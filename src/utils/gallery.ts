// src/utils/gallery.ts
export type GalleryPhoto = {
  src: string;
  alt: string;
  order?: number;
  groupKey: string;
  groupIndex: number;
};

export type GalleryEntryLike = {
  id: string;
  data: {
    order?: number;
    src?: string;
    alt?: string;
    images?: Array<{ src: string; alt?: string }>;
  };
};

export function buildGalleryPhotos(entries: GalleryEntryLike[]): GalleryPhoto[] {
  const photos = entries.flatMap((entry) => {
    const { data } = entry;
    const shared = { order: data.order };

    if (Array.isArray(data.images)) {
      return data.images.map((photo, i) => {
        const cleanSrc = photo.src.replace(/^\//, "");
        return {
          src: cleanSrc,
          // Provide fallback if alt was omitted in Decap CMS
          alt: photo.alt || "Снимка от ресторант Старата къща",
          ...shared,
          groupKey: entry.id,
          groupIndex: i,
        };
      });
    }

    const rawSrc = data.src ?? "";
    const cleanSrc = rawSrc.replace(/^\//, "");

    return [
      {
        src: cleanSrc,
        alt: data.alt || "Снимка от ресторант Старата къща",
        ...shared,
        groupKey: entry.id,
        groupIndex: 0,
      },
    ];
  });

  photos.sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    if (a.groupKey !== b.groupKey) return a.groupKey.localeCompare(b.groupKey);
    return a.groupIndex - b.groupIndex;
  });

  return photos;
}
