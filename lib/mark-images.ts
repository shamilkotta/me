export type MarkImagePreset = "thumb" | "detail" | "placeholder";

const MEDIA_PATH = "/api/marks";

type PresetOptions = {
  width?: number;
  height?: number;
  fit?: string;
  blur?: number;
  quality?: number;
};

const PRESETS = {
  thumb: {
    width: 400,
    height: 500,
    fit: "cover",
    quality: 75,
  },
  detail: {
    width: 1120,
    fit: "scale-down",
    quality: 85,
  },
  placeholder: {
    width: 64,
    height: 80,
    fit: "cover",
    blur: 20,
    quality: 55,
  },
} as const satisfies Record<MarkImagePreset, PresetOptions>;

type MarkImageOptions = {
  dpr?: number;
  grayscale?: boolean;
  placeholderSrc?: string;
};

function encodeOptions(
  preset: MarkImagePreset,
  { dpr = 1, grayscale = false }: MarkImageOptions = {},
) {
  const searchParams = new URLSearchParams();
  const options: PresetOptions = PRESETS[preset];
  if (options.width) searchParams.set("width", options.width.toString());
  if (options.height) searchParams.set("height", options.height.toString());
  if (options.fit) searchParams.set("fit", options.fit);
  if (options.blur) searchParams.set("blur", options.blur.toString());
  if (options.quality) searchParams.set("quality", options.quality.toString());
  if (dpr > 1) searchParams.set("dpr", dpr.toString());
  if (grayscale) searchParams.set("saturation", "0");
  return searchParams.toString();
}

function markImageOrigin() {
  return import.meta.env.NLITE_PUBLIC_MARKS_IMAGE_ORIGIN.replace(/\/$/, "");
}

export function markImageUrl(
  imageKey: string,
  preset: MarkImagePreset,
  { dpr = 1, grayscale = false }: MarkImageOptions = {},
) {
  const options = encodeOptions(preset, { dpr, grayscale });
  const src = new URL(`${MEDIA_PATH}/${imageKey}`, markImageOrigin());
  src.search = options;
  return src.toString();
}

export function markImageSrcSet(
  imageKey: string,
  preset: Exclude<MarkImagePreset, "placeholder">,
  { grayscale = false }: Pick<MarkImageOptions, "grayscale"> = {},
) {
  return `${markImageUrl(imageKey, preset, { dpr: 1, grayscale })} 1x, ${markImageUrl(imageKey, preset, { dpr: 2, grayscale })} 2x`;
}

export function markImageSources(
  imageKey: string,
  preset: Exclude<MarkImagePreset, "placeholder">,
  options: MarkImageOptions = {},
) {
  const grayscale = options.grayscale ?? false;
  return {
    placeholderSrc: options.placeholderSrc ?? markImageUrl(imageKey, "placeholder", { grayscale }),
    src: markImageUrl(imageKey, preset, { grayscale }),
    srcSet: markImageSrcSet(imageKey, preset, { grayscale }),
  };
}
