"use client";

import { useEffect } from "react";

import { MarkCarousel } from "@/components/mark-carousel";
import { MarkLocation } from "@/components/mark-location";
import { formatMarkDate, hasImages, type Mark } from "@/lib/marks";

type MarkLightboxProps = {
  mark: Mark;
  onClose: () => void;
};

export function MarkLightbox({ mark, onClose }: MarkLightboxProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-bg/85"
        onClick={onClose}
        type="button"
      />

      <button
        className="fixed right-6 top-6 z-60 text-[0.8125rem] text-muted transition-colors hover:text-fg"
        onClick={onClose}
        type="button"
      >
        close
      </button>

      <div
        className="relative w-full max-w-[560px] p-4 sm:p-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <header className="mb-4">
          <p className="mb-1 text-xs tabular-nums text-muted">{formatMarkDate(mark.date)}</p>
          <h2 className="text-sm font-semibold">{mark.caption}</h2>
          {mark.location ? <MarkLocation className="mt-2" location={mark.location} /> : null}
          {mark.body ? (
            <p className="mt-2 line-clamp-4 text-[0.8125rem] text-muted">{mark.body}</p>
          ) : null}
        </header>

        {hasImages(mark) ? <MarkCarousel caption={mark.caption} images={mark.images!} /> : null}
      </div>
    </div>
  );
}
