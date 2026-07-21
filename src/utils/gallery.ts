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
    images?: Array<{ src: string; alt: string }>;
  };
};

export function buildGalleryPhotos(entries: GalleryEntryLike[]): GalleryPhoto[] {
  const photos = entries.flatMap((entry) => {
    const { data } = entry;
    const shared = { order: data.order };

    if (Array.isArray(data.images)) {
      return data.images.map((photo, i) => ({
        src: photo.src,
        alt: photo.alt,
        ...shared,
        groupKey: entry.id,
        groupIndex: i,
      }));
    }

    return [
      {
        src: data.src ?? "",
        alt: data.alt ?? "",
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
