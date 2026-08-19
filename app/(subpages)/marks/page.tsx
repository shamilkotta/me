import { MarksGrid } from "@/components/marks-grid";
import { sortedMarksWithBlurDataURL } from "@/lib/marks-blur";
import { buildPageOgMetadata } from "@/lib/page-og";

export async function generateMetadata() {
  return buildPageOgMetadata("marks", {
    robots: {
      index: false,
      follow: false,
    },
  });
}

export default async function MarksPage() {
  const marks = await sortedMarksWithBlurDataURL({ cache: true });

  return (
    <>
      <h1 className="mb-8 text-base font-semibold tracking-normal">marks</h1>
      <MarksGrid marks={marks} />
    </>
  );
}
