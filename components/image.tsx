"use client";

import { type ComponentProps, useEffect, useState } from "react";

type ImageProps = ComponentProps<"img"> & {
  placeholderSrc?: string;
  grayscale?: boolean;
  fill?: boolean;
};

export function Image({
  placeholderSrc,
  grayscale = false,
  fill = false,
  className = "",
  onLoad,
  src,
  srcSet,
  alt,
  style,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const filterClass = grayscale ? "grayscale" : "grayscale-0";
  const layoutClass = fill ? "size-full object-cover" : "";

  useEffect(() => {
    setLoaded(false);
  }, [src, srcSet, placeholderSrc]);

  const handleLoad: ComponentProps<"img">["onLoad"] = (event) => {
    setLoaded(true);
    onLoad?.(event);
  };

  const placeholderStyle =
    placeholderSrc && !loaded
      ? {
          backgroundImage: `url("${placeholderSrc}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {};

  return (
    <img
      alt={alt}
      className={`${layoutClass} ${filterClass} ${className}`.trim()}
      decoding="async"
      onLoad={handleLoad}
      src={src}
      srcSet={srcSet}
      style={{
        ...(placeholderSrc ? { color: "transparent" } : {}),
        ...placeholderStyle,
        ...style,
      }}
      {...props}
    />
  );
}
