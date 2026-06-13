import { markImageBlurDataURL } from "@/lib/mark-images";
import { sortedMarks } from "@/lib/marks";

const blurDataURLInflight = new Map<string, Promise<string | undefined>>();

async function getBlurDataURL(imageKey: string, options = { cache: true }) {
  const inflight = blurDataURLInflight.get(imageKey);
  if (inflight) return inflight;

  const promise = fetch(markImageBlurDataURL(imageKey, { nocache: !options.cache }), {
    cache: "force-cache",
  })
    .then(async (response) => {
      if (!response.ok) return undefined;
      const blurDataURL = await response.text();
      return blurDataURL || undefined;
    })
    .catch(() => undefined)
    .finally(() => {
      blurDataURLInflight.delete(imageKey);
    });

  blurDataURLInflight.set(imageKey, promise);
  return promise;
}

export async function sortedMarksWithBlurDataURL(options = { cache: true }) {
  const marks = sortedMarks();

  return Promise.all(
    marks.map(async (mark) => ({
      ...mark,
      images: await Promise.all(
        (mark.images ?? []).map(async (image) => ({
          ...image,
          blurDataURL: await getBlurDataURL(image.key, options),
        })),
      ),
    })),
  );
}
