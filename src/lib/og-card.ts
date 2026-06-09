/**
 * Genererer delingskort (Open Graph-billeder) på 1200x630 ved build.
 *
 * Kortet komponeres med satori (layout og tekst som SVG), rasteriseres med
 * resvg og leveres som JPEG via sharp. Fotoet er artiklens heroImage, beskåret
 * til kortets format, med wordmark og titel lagt ovenpå. Artikler uden foto
 * får et roligt kort i papirtonen i stedet.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import type { ImageMetadata } from "astro";

export interface OgCardInput {
  title: string;
  heroImage?: ImageMetadata;
}

const WIDTH = 1200;
const HEIGHT = 630;

// Farverne spejler designtokens i src/styles/global.css (@theme). Satori kan
// ikke læse CSS-variabler, så værdierne gentages her; ret begge steder.
const COLOR = {
  paper: "#f6f3ec",
  cream: "#fcfaf5",
  creamMuted: "rgba(252,250,245,0.78)",
  ink: "#2c2a24",
  inkMuted: "#847f74",
  matcha50: "#f2f4ea",
};

// Skemaernes image() giver kun metadata (src, bredde, højde), ikke filens
// bytes. Vi globber derfor de samme kildefiler og finder fs-stien ved at
// matche på den processerede src, som er ens for begge importveje.
const sourceImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/**/*.{webp,png,jpg,jpeg}",
  { eager: true },
);
const fsPathBySrc = new Map<string, string>(
  Object.entries(sourceImages).map(([key, mod]) => [
    mod.default.src,
    path.join(process.cwd(), key),
  ]),
);

const frauncesMedium = await readFile(
  path.join(process.cwd(), "node_modules/@fontsource/fraunces/files/fraunces-latin-500-normal.woff"),
);
const frauncesSemibold = await readFile(
  path.join(process.cwd(), "node_modules/@fontsource/fraunces/files/fraunces-latin-600-normal.woff"),
);
const interMedium = await readFile(
  path.join(process.cwd(), "node_modules/@fontsource/inter/files/inter-latin-500-normal.woff"),
);

const leafPng = await readFile(path.join(process.cwd(), "public/images/logo/leaf_logo.png"));

/** Indfarver bladlogoet i en flad farve (stregens alfa bevares). */
async function tintedLeafUri(color: string): Promise<string> {
  const { width, height } = await sharp(leafPng).metadata();
  const tinted = await sharp({
    create: { width: width!, height: height!, channels: 4, background: color },
  })
    .composite([{ input: leafPng, blend: "dest-in" }])
    .png()
    .toBuffer();
  return `data:image/png;base64,${tinted.toString("base64")}`;
}

/** Beskærer heroen til kortets fulde flade og pakker den som data-URI. */
async function photoUri(fsPath: string): Promise<string> {
  const jpeg = await sharp(fsPath)
    .rotate()
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .jpeg({ quality: 80 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

// Satori bruger React-lignende objekttræer; en lille hjælper holder dem læsbare.
type Node = {
  type: string;
  props: Record<string, unknown> & { children?: Node[] | string };
};
const el = (
  type: string,
  props: Record<string, unknown>,
  children?: Node[] | string,
): Node => ({ type, props: { ...props, children } });

/**
 * Wordmark-blokken, samme opbygning som sidehovedets logo: bladet til venstre
 * og to tekstlinjer, navnet i Fraunces og taglinen i spatieret Inter-versal.
 */
function wordmark(leafUri: string, nameColor: string, taglineColor: string): Node {
  return el("div", { style: { display: "flex", alignItems: "center", gap: 18 } }, [
    el("img", { src: leafUri, width: 52, height: 50 }),
    el("div", { style: { display: "flex", flexDirection: "column" } }, [
      el(
        "div",
        {
          style: {
            fontFamily: "Fraunces",
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: -0.6,
            color: nameColor,
          },
        },
        "Matchabladet.dk",
      ),
      el(
        "div",
        {
          style: {
            marginTop: 5,
            fontFamily: "Inter",
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: 3,
            color: taglineColor,
          },
        },
        "ET DANSK MATCHA-MAGASIN",
      ),
    ]),
  ]);
}

/** Titlen, klampet til tre linjer; lange titler sættes en anelse mindre. */
function titleBlock(title: string, color: string): Node {
  return el(
    "div",
    {
      style: {
        display: "block",
        lineClamp: 3,
        marginTop: 24,
        maxWidth: 1020,
        fontSize: title.length > 75 ? 49 : 56,
        fontWeight: 600,
        lineHeight: 1.16,
        color,
      },
    },
    title,
  );
}

/** Kort med foto: heroen i fuld flade, mørk bund-gradient, lys tekst. */
async function photoCard(title: string, heroFsPath: string): Promise<Node> {
  const [photo, leaf] = await Promise.all([photoUri(heroFsPath), tintedLeafUri(COLOR.cream)]);
  return el(
    "div",
    {
      style: {
        display: "flex",
        width: WIDTH,
        height: HEIGHT,
        position: "relative",
        backgroundColor: COLOR.paper,
        fontFamily: "Fraunces",
      },
    },
    [
      el("img", { src: photo, width: WIDTH, height: HEIGHT, style: { position: "absolute", top: 0, left: 0 } }),
      el("div", {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: WIDTH,
          height: HEIGHT,
          backgroundImage:
            "linear-gradient(to top, rgba(26,24,19,0.86) 0%, rgba(26,24,19,0.52) 28%, rgba(26,24,19,0) 64%)",
        },
      }),
      el(
        "div",
        {
          style: {
            position: "absolute",
            left: 76,
            bottom: 60,
            display: "flex",
            flexDirection: "column",
          },
        },
        [wordmark(leaf, COLOR.cream, COLOR.creamMuted), titleBlock(title, COLOR.cream)],
      ),
    ],
  );
}

/** Kort uden foto: papirtone, blæk-titel og et stort, svagt blad som dekoration. */
async function plainCard(title: string): Promise<Node> {
  const leaf = `data:image/png;base64,${leafPng.toString("base64")}`;
  return el(
    "div",
    {
      style: {
        display: "flex",
        width: WIDTH,
        height: HEIGHT,
        position: "relative",
        backgroundImage: `linear-gradient(150deg, ${COLOR.matcha50} 0%, ${COLOR.paper} 60%)`,
        fontFamily: "Fraunces",
      },
    },
    [
      el("img", {
        src: leaf,
        width: 380,
        height: 365,
        style: { position: "absolute", right: -48, top: -36, opacity: 0.12, transform: "rotate(-14deg)" },
      }),
      el(
        "div",
        {
          style: {
            position: "absolute",
            left: 76,
            bottom: 60,
            display: "flex",
            flexDirection: "column",
          },
        },
        [wordmark(leaf, COLOR.ink, COLOR.inkMuted), titleBlock(title, COLOR.ink)],
      ),
    ],
  );
}

/** Renderer ét delingskort og returnerer det som JPEG-bytes. */
export async function renderOgCard({ title, heroImage }: OgCardInput): Promise<Uint8Array<ArrayBuffer>> {
  const heroFsPath = heroImage ? fsPathBySrc.get(heroImage.src) : undefined;
  const card = heroFsPath ? await photoCard(title, heroFsPath) : await plainCard(title);

  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: "Fraunces", data: frauncesMedium, weight: 500, style: "normal" },
      { name: "Fraunces", data: frauncesSemibold, weight: 600, style: "normal" },
      { name: "Inter", data: interMedium, weight: 500, style: "normal" },
    ],
  });

  const png = new Resvg(svg).render().asPng();
  const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  // Kopien giver en Uint8Array over en almindelig ArrayBuffer, som Response accepterer.
  return new Uint8Array(jpeg);
}
