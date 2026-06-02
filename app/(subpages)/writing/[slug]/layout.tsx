import type { PropsWithChildren } from "react";

import { SiteNav } from "@/components/site-nav";

export default function WritingPostLayout({ children }: PropsWithChildren) {
  return (
    <>
      <SiteNav className="mb-10" variant="writing-post" />
      {children}
    </>
  );
}
