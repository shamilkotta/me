"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Copy, Download } from "lucide-react";

import { isImageOnlyItem, type CollectionItem } from "@/lib/collections";
import {
  fetchOgImageForItem,
  resolveItemImageUrl,
  shouldFetchOgImage,
} from "@/lib/collections-media";

type CollectionCardProps = {
  item: CollectionItem;
  cardRef: (element: HTMLElement | null) => void;
  onActivate: () => void;
};

function cardLabel(item: CollectionItem) {
  const tags = item.tags.length > 0 ? `. Tags: ${item.tags.join(", ")}` : "";
  return `${item.title ?? item.type}${tags}`;
}

function CardText({ item }: { item: CollectionItem }) {
  return (
    <>
      {item.title ? <p className="text-[0.8125rem] leading-snug">{item.title}</p> : null}
      {item.tags.length > 0 ? (
        <p
          className={`line-clamp-2 text-[0.75rem] leading-snug text-muted ${item.title ? "mt-1" : ""}`}
        >
          {item.tags.map((tag) => `#${tag}`).join(" ")}
        </p>
      ) : null}
    </>
  );
}

function ImageOverlay({ item }: { item: CollectionItem }) {
  if (!item.title && item.tags.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-focus-within:-translate-y-0.5">
      <CardText item={item} />
    </div>
  );
}

async function fetchImageBlob(imageUrl: string) {
  if (imageUrl.startsWith("data:")) {
    const response = await fetch(imageUrl);
    return response.blob();
  }

  const response = await fetch(`/collections/image?url=${encodeURIComponent(imageUrl)}`);
  if (!response.ok) throw new Error("failed to fetch image");

  return response.blob();
}

function extensionForMime(mime: string) {
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("svg")) return "svg";
  return "png";
}

async function copyImageToClipboard(imageUrl: string) {
  const blob = await fetchImageBlob(imageUrl);
  const type = blob.type || "image/png";
  await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
}

async function downloadImage(imageUrl: string, filename: string) {
  const blob = await fetchImageBlob(imageUrl);
  const extension = extensionForMime(blob.type);
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = `${filename}.${extension}`;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

function ImageActions({ imageUrl, itemId }: { imageUrl: string; itemId: string }) {
  const [status, setStatus] = useState<string | null>(null);

  function clearStatus() {
    window.setTimeout(() => setStatus(null), 1500);
  }

  async function handleCopy(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    try {
      await copyImageToClipboard(imageUrl);
      setStatus("copied");
    } catch {
      setStatus("copy failed");
    } finally {
      clearStatus();
    }
  }

  async function handleDownload(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    try {
      await downloadImage(imageUrl, itemId);
      setStatus("downloaded");
    } catch {
      setStatus("download failed");
    } finally {
      clearStatus();
    }
  }

  return (
    <>
      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <button
          aria-label="Copy image"
          className="bg-bg/90 p-1.5 text-fg backdrop-blur-sm cursor-pointer"
          onClick={handleCopy}
          type="button"
        >
          <Copy className="size-3.5" />
        </button>
        <button
          aria-label="Download image"
          className="bg-bg/90 p-1.5 text-fg backdrop-blur-sm cursor-pointer"
          onClick={handleDownload}
          type="button"
        >
          <Download className="size-3.5" />
        </button>
      </div>
      {status ? (
        <div className="pointer-events-none absolute left-2 top-2 bg-bg/90 px-2 py-1 text-[0.6875rem] backdrop-blur-sm">
          {status}
        </div>
      ) : null}
    </>
  );
}

function CollectionCardShell({
  item,
  cardRef,
  onActivate,
  children,
}: CollectionCardProps & { children: ReactNode }) {
  const isLink = Boolean(item.url && !isImageOnlyItem(item));

  return (
    <article
      aria-label={cardLabel(item)}
      className={`group block rounded-none outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${isLink ? "cursor-pointer" : ""}`}
      onClick={(event) => {
        if (!isLink) return;
        if ((event.target as HTMLElement).closest("button")) return;
        onActivate();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (event.target !== event.currentTarget) return;
        if (!isLink) return;

        event.preventDefault();
        onActivate();
      }}
      ref={cardRef}
      role={isLink ? "link" : "group"}
      tabIndex={0}
    >
      {children}
    </article>
  );
}

function shouldRenderImageCard(item: CollectionItem) {
  return Boolean(resolveItemImageUrl(item) || shouldFetchOgImage(item));
}

function useInViewport() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [inView, setInView] = useState(false);

  const ref = useCallback(
    (element: Element | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!element || inView) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: "500px 0px" },
      );

      observer.observe(element);
      observerRef.current = observer;
    },
    [inView],
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return { ref, inView };
}

function useCollectionImage(item: CollectionItem, enabled: boolean) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const resolved = resolveItemImageUrl(item);
    if (resolved) {
      setImageUrl(resolved);
      setLoading(false);
      return;
    }

    if (!shouldFetchOgImage(item)) {
      setImageUrl(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchOgImageForItem(item.url!)
      .then((ogImage) => {
        if (!cancelled) setImageUrl(ogImage);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, item.id, item.url, item.imageUrl, item.type]);

  return {
    imageUrl: enabled ? imageUrl : null,
    loading: enabled && loading && !imageUrl,
  };
}

function useImageSize(src: string | null) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) {
      setSize(null);
      setFailed(false);
      return;
    }

    let cancelled = false;
    setSize(null);
    setFailed(false);

    const image = new window.Image();

    function commit() {
      if (cancelled || !image.naturalWidth || !image.naturalHeight) return;
      setSize({ width: image.naturalWidth, height: image.naturalHeight });
    }

    function fail() {
      if (!cancelled) setFailed(true);
    }

    image.addEventListener("load", commit);
    image.addEventListener("error", fail);
    image.src = src;

    if (image.complete) commit();

    return () => {
      cancelled = true;
      image.removeEventListener("load", commit);
      image.removeEventListener("error", fail);
    };
  }, [src]);

  return { size, failed };
}

function ImageCard({ item, cardRef, onActivate }: CollectionCardProps) {
  const { ref: viewportRef, inView } = useInViewport();
  const { imageUrl, loading } = useCollectionImage(item, inView);
  const { size, failed } = useImageSize(imageUrl);

  const mergedRef = useCallback(
    (element: HTMLElement | null) => {
      viewportRef(element);
      cardRef(element);
    },
    [viewportRef, cardRef],
  );

  const showTextFallback = inView && !loading && (!imageUrl || failed);

  return (
    <CollectionCardShell cardRef={mergedRef} item={item} onActivate={onActivate}>
      {imageUrl && size ? (
        <div
          className="relative overflow-hidden border border-border bg-bg transition-colors group-focus-within:border-fg/30 group-hover:border-fg/30"
          style={{ aspectRatio: `${size.width} / ${size.height}` }}
        >
          <img
            alt=""
            className="block h-auto w-full"
            decoding="async"
            height={size.height}
            src={imageUrl}
            width={size.width}
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/45 to-transparent opacity-95 transition-opacity duration-300 group-focus-within:opacity-80 group-hover:opacity-80" />
          <ImageOverlay item={item} />
          <ImageActions imageUrl={imageUrl} itemId={item.id} />
        </div>
      ) : showTextFallback ? (
        <div className="border border-border p-3 transition-colors group-focus-within:border-fg/30 group-hover:border-fg/30">
          <CardText item={item} />
        </div>
      ) : (
        <div className="flex min-h-16 items-center justify-center border border-border bg-fg/3 px-3 py-6">
          <span className="text-[0.6875rem] text-muted">loading preview...</span>
        </div>
      )}
    </CollectionCardShell>
  );
}

function TextCard({ item, cardRef, onActivate }: CollectionCardProps) {
  return (
    <CollectionCardShell cardRef={cardRef} item={item} onActivate={onActivate}>
      <div className="border border-border p-3 transition-colors group-focus-within:border-fg/30 group-hover:border-fg/30">
        <CardText item={item} />
      </div>
    </CollectionCardShell>
  );
}

export function CollectionCard(props: CollectionCardProps) {
  if (shouldRenderImageCard(props.item)) {
    return <ImageCard {...props} />;
  }

  return <TextCard {...props} />;
}
