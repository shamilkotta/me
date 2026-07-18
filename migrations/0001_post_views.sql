CREATE TABLE IF NOT EXISTS post_visitors (
  slug TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  country TEXT,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (slug, visitor_hash)
);
