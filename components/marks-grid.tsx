"use client";

import { useState } from "react";

import { MarkCard } from "@/components/mark-card";
import { MarkLightbox } from "@/components/mark-lightbox";
import type { Mark } from "@/lib/marks";

type MarksGridProps = {
  marks: Mark[];
};

export function MarksGrid({ marks }: MarksGridProps) {
  const [selected, setSelected] = useState<Mark | null>(null);

  return (
    <>
      <div className="columns-2 gap-3 [content-visibility:auto] sm:columns-3">
        {marks.map((mark, index) => (
          <MarkCard index={index} key={mark.slug} mark={mark} onSelect={() => setSelected(mark)} />
        ))}
      </div>

      {selected ? <MarkLightbox mark={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}
