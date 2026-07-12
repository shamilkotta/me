import COLLECTIONS from "../collections.json";

export type CollectionType =
  | "website"
  | "library"
  | "component"
  | "design"
  | "image"
  | "article"
  | "other";

export type CollectionItem = {
  id: string;
  title?: string;
  url?: string;
  description?: string;
  type: CollectionType;
  tags: string[];
  imageUrl?: string;
  notes?: string;
  createdAt: string;
};

export function sortedCollections() {
  return [...COLLECTIONS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function matchesQuery(item: CollectionItem, query: string) {
  if (!query.trim()) return true;

  const haystack = [item.title, item.description, item.notes, item.url, item.type, ...item.tags]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

export function isImageOnlyItem(item: CollectionItem) {
  return (
    item.type === "image" &&
    !item.title?.trim() &&
    item.tags.length === 0 &&
    !item.description?.trim() &&
    !item.notes?.trim()
  );
}
