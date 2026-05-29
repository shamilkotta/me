import type { PropsWithChildren } from "react";

import { SiteNav } from "@/components/site-nav";

export default function SubpagesLayout({ children }: PropsWithChildren) {
  return (
    <>
      <SiteNav className="mb-10" showHome />
      {children}
    </>
  );
}
