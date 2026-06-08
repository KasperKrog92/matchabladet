import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const tags = z.array(z.string()).default([]);

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/reviews" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    city: z.string(),
    cafeName: z.string(),
    address: z.string().optional(),
    visitedDate: z.coerce.date(),
    drinkType: z.string(),
    milkType: z.string().optional(),
    priceDkk: z.number().optional(),
    overallRating: z.number().min(1).max(10),
    matchaQuality: z.number().min(1).max(10),
    preparation: z.number().min(1).max(10),
    texture: z.number().min(1).max(10),
    atmosphere: z.number().min(1).max(10),
    veganFriendly: z.boolean(),
    excerpt: z.string(),
    tags,
    heroImage: z.string().optional()
  })
});

const editorialSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags,
  featured: z.boolean().default(false),
  heroImage: z.string().optional()
});

const guides = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/guides" }),
  schema: editorialSchema
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: editorialSchema
});

export const collections = { reviews, guides, blog };
