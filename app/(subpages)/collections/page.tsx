import { CollectionsView } from "@/components/collections/collections-view";
import { SiteNav } from "@/components/site-nav";
import { sortedCollections } from "@/lib/collections";
import { buildPageOgMetadata } from "@/lib/og/page";

export const metadata = buildPageOgMetadata("collections", {
  robots: {
    index: false,
    follow: false,
  },
});

export default function CollectionsPage() {
  const items = sortedCollections();

  return (
    <>
      <SiteNav className="mb-10" variant="section" />
      <h1 className="mb-8 text-base font-semibold tracking-normal">collections</h1>
      <CollectionsView items={items} />
    </>
  );
}
