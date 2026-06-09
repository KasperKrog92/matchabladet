<#
.SYNOPSIS
  Konverterer rå foto/video til web-klar form til Matchabladet, med et
  ensartet, roligt farve-grade (japandi/editorial).

.DESCRIPTION
  Stillbilleder bliver til .webp (lang side <= 1920 px).
  Klip bliver til lydløs, web-klar H.264 .mp4 (lang side <= 1280 px,
  yuv420p + faststart, rotation bagt ind).

  Samme grade lægges på både billeder og klip, så en videos plakat (stillet)
  og selve afspilningen har samme tone. Brug -NoGrade for rå konvertering.

  Kræver ffmpeg + ffprobe på PATH (installeres med: winget install Gyan.FFmpeg).

.PARAMETER InputPath
  Kildefil (.jpg/.jpeg/.png/.mp4/.mov).

.PARAMETER OutputPath
  Outputfil. Endelsen styrer formatet: .webp = billede, .mp4 = video.

.PARAMETER NoGrade
  Spring farve-grade over.

.EXAMPLE
  ./scripts/convert-media.ps1 src/assets/images/cafe-by/originals/hero.jpg src/assets/images/cafe-by/hero.webp

.EXAMPLE
  ./scripts/convert-media.ps1 originals/klip.mov ../cafe-by/hero.mp4
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$InputPath,
  [Parameter(Mandatory)][string]$OutputPath,
  [switch]$NoGrade
)

$ErrorActionPreference = "Stop"

foreach ($tool in "ffmpeg", "ffprobe") {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
    throw "$tool blev ikke fundet på PATH. Installer med: winget install Gyan.FFmpeg (og åbn en ny terminal)."
  }
}
if (-not (Test-Path $InputPath)) { throw "Kildefil findes ikke: $InputPath" }

# --- Det fælles farve-grade ------------------------------------------------
# Blød kontrast, let afmætning, lille midttone-løft og en anelse varme. Hold
# det diskret – det skal samle udtrykket, ikke se ud som et filter.
$grade = "eq=contrast=1.05:brightness=0.012:saturation=0.93:gamma=1.02," +
         "colorbalance=rm=0.025:bm=-0.025:rh=0.012:bh=-0.012"

$isVideo = [IO.Path]::GetExtension($OutputPath).ToLower() -eq ".mp4"

# Skalér ind i en kvadratisk boks (bevarer forholdet og opskalerer aldrig;
# boksen begrænses til kildens egne mål). Stillbilleder: 1920. Klip: 1280.
$box = if ($isVideo) { 1280 } else { 1920 }
$scale = "scale=w='min($box,iw)':h='min($box,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2"

$vf = if ($NoGrade) { $scale } else { "$scale,$grade" }

if ($isVideo) {
  ffmpeg -y -loglevel error -i $InputPath -an -vf $vf `
    -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart $OutputPath
} else {
  ffmpeg -y -loglevel error -i $InputPath -vf $vf -c:v libwebp -quality 82 $OutputPath
}

$out = Get-Item $OutputPath
$dim = ffprobe -v error -select_streams v:0 -show_entries "stream=width,height" -of csv=p=0 $OutputPath
"OK  {0}  {1:N0} KB  {2}  (grade: {3})" -f $out.Name, ($out.Length / 1KB), $dim, (-not $NoGrade)
