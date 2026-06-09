import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Anmeldelser af matcha-caféer.
 * Karakterer gives på en skala fra 1-10.
 * heroImage refererer et billede i src/assets og optimeres af Astro.
 */
const reviews = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/reviews" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      city: z.string(),
      cafeName: z.string(),
      address: z.string().optional(),
      visitedDate: z.coerce.date(),
      drinkType: z.string(),
      milkType: z.string().optional(),
      plantMilkService: z.enum(["standard", "skal-bestilles", "ikke-tilbudt"]),
      priceDkk: z.number().optional(),
      overallRating: z.number().min(1).max(10),
      matchaQuality: z.number().min(1).max(10),
      preparation: z.number().min(1).max(10),
      texture: z.number().min(1).max(10),
      atmosphere: z.number().min(1).max(10),
      excerpt: z.string(),
      heroImage: image().optional(),
      // Valgfri, lydløs klip (sti relativt til src/assets/images, fx
      // "cafe-by/hero.mp4"). Afspilles i loop oven på heroImage, der bruges
      // som plakat. Optimeres ikke af Astro, så konvertér selv med ffmpeg.
      heroVideo: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

/**
 * Guides og forklarende artikler om matcha.
 */
const guides = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/guides" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      excerpt: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      level: z.enum(["begynder", "øvet", "ekspert"]).default("begynder"),
      readingTime: z.string().optional(),
      heroImage: image().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

/**
 * Blogindlæg og personlige refleksioner.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      excerpt: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default("Redaktionen"),
      readingTime: z.string().optional(),
      heroImage: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { reviews, guides, blog };
