import { SiteNav } from "@/components/site-nav";
import type { PropsWithChildren } from "react";

export default function MarksLayout({ children }: PropsWithChildren) {
  return (
    <>
      <SiteNav className="mb-10" variant="section" />
      {children}
    </>
  );
}
