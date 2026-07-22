import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const menu = defineCollection({
  // glob() scans a directory and turns each matching file into one entry.
  // The filename (minus extension) becomes the entry's `id` — e.g.
  // src/content/menu/predyastiya.yaml -> id: "predyastiya"
  loader: glob({ pattern: "**/*.{yaml,yml,json}", base: "./src/content/menu" }),
  schema: z.object({
    // Human-readable category title, shown as the page heading
    categoryTitle: z.string(),
    // Optional date shown next to the title — for menus that change daily/weekly,
    // e.g. "Обедно меню". Free text, e.g. "17.07.2026" — not parsed as a real date,
    // since these are just printed on the page, not used for logic.
    categoryDate: z.string().optional(),
    items: z.array(
      z.object({
        name: z.string().optional(),
        weight: z.string().optional(), // e.g. "200 гр."
        priceEur: z.number().optional(), // e.g. 5.90
        priceBgn: z.number().optional(), // some items are EUR-only, e.g. "Леща-2.50Е"
        note: z.string().optional(), // e.g. "люто" / "препоръчано"
        // Optional section label shown ABOVE this item, e.g. "Нашето предложение
        // (приготвя се на момента)" or "Скара". Put it on the first item of a new
        // group; leave it out for every item that continues the same group.
        subheading: z.string().optional(),
      }),
    ),
  }),
});

const galleryPhoto = z.object({
  src: z.string(),
  alt: z.string().optional(),
});

const gallery = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml,json}", base: "./src/content/gallery" }),
  schema: z
    .object({
      category: z.string().optional(),
      order: z.number().optional(),
    })
    .and(z.union([galleryPhoto, z.object({ images: z.array(galleryPhoto).min(1) })])),
});

export const collections = { menu, gallery };
