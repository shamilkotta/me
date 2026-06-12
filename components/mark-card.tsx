import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { MarkLocation } from "@/components/mark-location";
import { markImageSources } from "@/lib/mark-images";
import { formatMarkDateShort, markCover, type Mark } from "@/lib/marks";

const IMAGE_ASPECTS = ["aspect-[4/5]", "aspect-[3/4]", "aspect-square"] as const;

type MarkCardProps = {
  mark: Mark;
  index: number;
  onSelect: () => void;
};

function CardButton({
  children,
  className,
  onSelect,
}: {
  children: ReactNode;
  className: string;
  onSelect: () => void;
}) {
  return (
    <button
      className={`${className} block w-full cursor-pointer bg-transparent p-0 text-left font-[inherit]`}
      onClick={onSelect}
      type="button"
    >
      {children}
    </button>
  );
}

export function MarkImageCard({ mark, index, onSelect }: MarkCardProps) {
  const aspect = IMAGE_ASPECTS[index % IMAGE_ASPECTS.length];
  const cover = markCover(mark);
  if (!cover) return null;

  const isPriority = index < 4;

  return (
    <CardButton
      className={`group relative mb-3 break-inside-avoid overflow-hidden border border-border bg-border/20 ${aspect}`}
      onSelect={onSelect}
    >
      <Image
        alt=""
        fill
        height={500}
        loading={isPriority ? "eager" : "lazy"}
        sizes="(min-width: 640px) 33vw, 50vw"
        width={400}
        {...markImageSources(cover.key, "thumb", {
          grayscale: true,
          placeholderSrc: cover.blurDataURL,
        })}
      />
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/45 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-80" />
      <div className="absolute inset-x-0 bottom-0 p-3 transition-transform duration-300 group-hover:-translate-y-0.5">
        <p className="text-[0.6875rem] tabular-nums text-muted">{formatMarkDateShort(mark.date)}</p>
        {mark.location ? <MarkLocation className="mt-1" location={mark.location} /> : null}
        <p className="mt-0.5 text-[0.8125rem] leading-snug">{mark.caption}</p>
        {mark.body ? (
          <p className="mt-1 line-clamp-2 text-[0.75rem] leading-snug text-muted">{mark.body}</p>
        ) : null}
      </div>
    </CardButton>
  );
}

const TEXT_HEIGHTS = ["min-h-28", "min-h-36", "min-h-32"] as const;

export function MarkTextCard({ mark, index, onSelect }: MarkCardProps) {
  const height = TEXT_HEIGHTS[index % TEXT_HEIGHTS.length];

  return (
    <CardButton
      className={`mb-3 flex break-inside-avoid flex-col justify-end border border-border p-3 ${height}`}
      onSelect={onSelect}
    >
      <p className="text-[0.6875rem] tabular-nums text-muted">{formatMarkDateShort(mark.date)}</p>
      {mark.location ? <MarkLocation className="mt-1" location={mark.location} /> : null}
      <p className="mt-1 text-[0.8125rem] leading-snug">{mark.caption}</p>
      {mark.body ? (
        <p className="mt-1.5 line-clamp-2 text-[0.75rem] leading-snug text-muted">{mark.body}</p>
      ) : null}
    </CardButton>
  );
}

export function MarkCard({ mark, index, onSelect }: MarkCardProps) {
  if (markCover(mark)) {
    return <MarkImageCard index={index} mark={mark} onSelect={onSelect} />;
  }

  return <MarkTextCard index={index} mark={mark} onSelect={onSelect} />;
}
