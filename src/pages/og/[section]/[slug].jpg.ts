/**
 * Delingskort (Open Graph-billeder) for alle artikler, genereret ved build.
 * Ruterne spejler sidens sektioner: /og/anmeldelser/<slug>.jpg,
 * /og/guides/<slug>.jpg og /og/blog/<slug>.jpg. Selve kompositionen ligger i
 * src/lib/og-card.ts.
 */
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getCollection } from "astro:content";
import { renderOgCard } from "../../../lib/og-card";

export const getStaticPaths = (async () => {
  const [reviews, guides, blog] = await Promise.all([
    getCollection("reviews"),
    getCollection("guides"),
    getCollection("blog"),
  ]);

  const sections = [
    { section: "anmeldelser", entries: reviews },
    { section: "guides", entries: guides },
    { section: "blog", entries: blog },
  ];

  return sections.flatMap(({ section, entries }) =>
    entries
      .filter((entry) => !entry.data.draft)
      .map((entry) => ({
        params: { section, slug: entry.data.slug },
        props: { title: entry.data.title, heroImage: entry.data.heroImage },
      })),
  );
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props }) => {
  const jpeg = await renderOgCard(props);
  return new Response(jpeg, { headers: { "Content-Type": "image/jpeg" } });
};
