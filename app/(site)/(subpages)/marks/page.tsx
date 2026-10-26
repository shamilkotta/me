import { ViewTransition } from "react";

import { MarksGrid } from "@/components/marks-grid";
import { sortedMarksWithBlurDataURL } from "@/lib/marks-blur";
import { sharedName } from "@/lib/view-transition";
import { buildPageOgMetadata } from "@/lib/og/page";

export const metadata = buildPageOgMetadata("marks", {
  robots: {
    index: false,
    follow: false,
  },
});

export default async function MarksPage() {
  const marks = await sortedMarksWithBlurDataURL({ cache: true });

  return (
    <>
      <ViewTransition name={sharedName("heading", "marks")}>
        <h1 className="mb-8 w-fit text-base font-semibold tracking-normal">marks</h1>
      </ViewTransition>
      <MarksGrid marks={marks} />
    </>
  );
}
