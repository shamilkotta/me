const OG_IMAGE_PATTERNS = [
  /<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::url)?["']/i,
  /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
];

function extractOgImage(html: string, baseUrl: URL): string | null {
  for (const pattern of OG_IMAGE_PATTERNS) {
    const match = html.match(pattern);
    if (!match?.[1]) continue;

    try {
      return new URL(match[1], baseUrl).toString();
    } catch {
      continue;
    }
  }

  return null;
}

export async function fetchOgImage(url: string): Promise<string | null> {
  const parsed = new URL(url);
  const response = await fetch(parsed.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; CollectionsBot/1.0)",
      Accept: "text/html",
    },
    redirect: "follow",
  });

  if (!response.ok) return null;

  const html = (await response.text()).slice(0, 500_000);
  return extractOgImage(html, parsed);
}
