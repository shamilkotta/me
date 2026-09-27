import type { PropsWithChildren } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteJsonLd } from "@/components/site-json-ld";

export default function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative mx-auto max-w-[800px] px-6 pb-16 pt-12 text-fg">
      <SiteJsonLd />
      {children}
      <SiteFooter />
    </div>
  );
}
