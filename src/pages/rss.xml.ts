import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE } from "../config";

/**
 * Samlet RSS-feed med alle udgivne artikler på tværs af de tre samlinger.
 * Anmeldelser dateres efter besøget, guides og blogindlæg efter udgivelsen.
 */
export async function GET(context: APIContext) {
  const reviews = (await getCollection("reviews")).filter((r) => !r.data.draft);
  const guides = (await getCollection("guides")).filter((g) => !g.data.draft);
  const posts = (await getCollection("blog")).filter((p) => !p.data.draft);

  const items = [
    ...reviews.map((review) => ({
      title: review.data.title,
      description: review.data.excerpt,
      link: `/anmeldelser/${review.data.slug}/`,
      pubDate: review.data.visitedDate,
    })),
    ...guides.map((guide) => ({
      title: guide.data.title,
      description: guide.data.excerpt,
      link: `/guides/${guide.data.slug}/`,
      pubDate: guide.data.publishDate,
    })),
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      link: `/blog/${post.data.slug}/`,
      pubDate: post.data.publishDate,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: `<language>${SITE.lang}</language>`,
  });
}
