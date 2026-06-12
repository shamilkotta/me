"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Image } from "@/components/image";
import { markImageSources } from "@/lib/mark-images";
import type { MarkImage } from "@/lib/marks";

type MarkCarouselProps = {
  images: MarkImage[];
  caption: string;
};

export function MarkCarousel({ images, caption }: MarkCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const slides = [...el.querySelectorAll<HTMLElement>("[data-slide]")];
    if (slides.length === 0) return;

    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const [index, slide] of slides.entries()) {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(center - slideCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    }

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateActiveIndex();
    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      el.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex, images.length]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="aspect-4/5 w-full">
        <Image
          alt={caption}
          fill
          height={700}
          loading="eager"
          sizes="(min-width: 640px) 560px, calc(100vw - 32px)"
          width={560}
          {...markImageSources(images[0].key, "detail", {
            placeholderSrc: images[0].blurDataURL,
          })}
        />
      </div>
    );
  }

  return (
    <div>
      <div
        className="scrollbar-none flex snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth px-0 sm:gap-2 sm:px-[3%] [&::-webkit-scrollbar]:hidden"
        ref={scrollRef}
      >
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          const isHighlighted = isActive || hoveredIndex === index;

          return (
            <div
              className="w-full shrink-0 snap-center sm:w-[94%]"
              data-slide
              key={image.key}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="aspect-4/5 w-full">
                <Image
                  alt={`${caption} — ${index + 1}`}
                  fill
                  grayscale={!isHighlighted}
                  height={700}
                  loading={index === 0 ? "eager" : "lazy"}
                  onFocus={() => setActiveIndex(index)}
                  sizes="(min-width: 640px) 560px, calc(100vw - 32px)"
                  tabIndex={0}
                  width={560}
                  {...markImageSources(image.key, "detail", {
                    placeholderSrc: image.blurDataURL,
                  })}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-center text-[0.6875rem] tabular-nums text-muted">
        {activeIndex + 1} / {images.length}
      </p>
    </div>
  );
}
