/**
 * Name for a `<ViewTransition>` shared between routes. Parts are sanitized into
 * a valid CSS ident; returns undefined (React falls back to an auto name) when
 * a part is unusable, so two elements never collide on an empty name.
 */
export function sharedName(...parts: string[]): string | undefined {
  const idents = parts.map((part) =>
    part
      .toLowerCase()
      .replace(/[^a-z0-9-·]+/g, "-")
      .replace(/^-+|-+$/g, ""),
  );
  if (idents.length === 0 || idents.some((ident) => !ident)) return undefined;
  return `vt-${idents.join("-")}`;
}
