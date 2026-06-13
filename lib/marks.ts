import MARKS from "../marks.json";

export type MarkImage = {
  key: string;
  blurDataURL?: string;
};

export type Mark = {
  slug: string;
  date: Date;
  caption: string;
  body?: string;
  location?: string;
  images?: MarkImage[];
};

export function formatMarkDate(date: Date) {
  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toLowerCase();
}

export function formatMarkDateShort(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toLowerCase();
}

export function sortedMarks() {
  return [...MARKS]
    .map((mark) => ({
      ...mark,
      date: new Date(mark.date),
      images: mark.images?.map((key) => ({ key })),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function markCover(mark: Mark) {
  return mark.images?.[0];
}

export function hasImages(mark: Mark) {
  return (mark.images?.length ?? 0) > 0;
}
