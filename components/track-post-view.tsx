"use client";

import { useEffect } from "react";

type TrackPostViewProps = {
  slug: string;
};

export function TrackPostView({ slug }: TrackPostViewProps) {
  useEffect(() => {
    const storageKey = `post-view:${slug}`;
    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // sessionStorage may be unavailable; still attempt to track once.
    }

    const body = JSON.stringify({ slug });
    const blob = new Blob([body], { type: "application/json" });

    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/views", blob);
      return;
    }

    void fetch("/api/views", {
      method: "POST",
      body,
      headers: { "content-type": "application/json" },
      keepalive: true,
    });
  }, [slug]);

  return null;
}
