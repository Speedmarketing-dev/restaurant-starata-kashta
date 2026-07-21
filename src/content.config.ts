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
        name: z.string(),
        weight: z.string().optional(), // e.g. "200 гр."
        priceEur: z.number(), // e.g. 5.90
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

// A single photo's data — reused for both the single-image shape and each
// entry inside the multi-image `images` array below.
const galleryPhoto = z.object({
  src: z.string(), // path or URL to the image
  alt: z.string(), // accessible description, also used as a caption
});

const gallery = defineCollection({
  // Same pattern as `menu`: one data file per gallery entry. This keeps every
  // photo's metadata (src, alt text, category) editable as plain data — no
  // code changes, and it slots straight into Decap CMS the same way the menu
  // collection does.
  //
  // Each file can describe EITHER a single photo (`src` + `alt` at the top
  // level — the original shape, still fully supported) OR a group of photos
  // that share one category/order (an `images` array of { src, alt }). Use
  // the array form when several shots belong together, e.g. one YAML file
  // per event or room with multiple photos, instead of duplicating
  // `category`/`order` across many files.
  loader: glob({ pattern: "**/*.{yaml,yml,json}", base: "./src/content/gallery" }),
  schema: z
    .object({
      category: z.string().optional(), // e.g. "Интериор", "Градина", "Ястия" — for future filtering
      order: z.number().optional(), // lower numbers show first; falls back to filename order
    })
    .and(
      z.union([
        // Single-image shape (original): src/alt live at the top level.
        galleryPhoto,
        // Multi-image shape: a group of photos under one entry.
        z.object({ images: z.array(galleryPhoto).min(1) }),
      ]),
    ),
});

export const collections = { menu, gallery };
