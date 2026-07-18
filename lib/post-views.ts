import { env } from "cloudflare:workers";
import type { WritingPost } from "@/lib/content";
import { getEntry } from "nlite/mdx";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BOT_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|python-requests|curl|wget|headless|scrapy|httpclient/i;

function isBot(userAgent: string) {
  return BOT_RE.test(userAgent);
}

function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function hashVisitor(ip: string, userAgent: string) {
  const data = new TextEncoder().encode(`${ip}\0${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function isValidPostSlug(slug: string) {
  return SLUG_RE.test(slug) && slug.length <= 120;
}

/** Running unique-visitor count for a post. Ready for future UI. */
export async function getPostViewCount(slug: string): Promise<number> {
  if (!isValidPostSlug(slug)) return 0;
  const row = await env.POST_VIEWS_DB.prepare(
    "SELECT COUNT(*) AS unique_visitors FROM post_visitors WHERE slug = ?",
  )
    .bind(slug)
    .first<{ unique_visitors: number }>();

  return row?.unique_visitors ?? 0;
}

/**
 * Record at most one unique visitor per post.
 * Writes Analytics Engine for history; D1 holds the display-ready count.
 */
export async function trackPostView(request: Request, slug: string): Promise<boolean> {
  if (!isValidPostSlug(slug)) return false;

  const post = await getEntry<WritingPost>("writing", slug);
  if (!post) return false;

  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent || isBot(userAgent)) return false;

  const visitorHash = await hashVisitor(getClientIp(request), userAgent);
  const country = request.headers.get("cf-ipcountry") ?? "XX";
  const day = new Date().toISOString().slice(0, 10);
  const inserted = await env.POST_VIEWS_DB.prepare(
    "INSERT OR IGNORE INTO post_visitors (slug, visitor_hash, country) VALUES (?, ?, ?)",
  )
    .bind(slug, visitorHash, country)
    .run();

  if (inserted.meta.changes === 0) return false;

  try {
    // Non-blocking in production; unavailable in local dev.
    env.ANALYTICS.writeDataPoint({
      indexes: [slug],
      blobs: [country, day],
      doubles: [1],
    });
  } catch {
    // Ignore Analytics Engine failures (e.g. local development).
  }

  return true;
}
