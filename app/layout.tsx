import type { PropsWithChildren } from "react";

import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { Metadata } from "nlite";

export const metadata: Metadata = {
  title: {
    default: "shamil",
    template: "%s | shamil",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-200 px-6 pb-16 pt-12 text-fg">
      {children}
      <SiteFooter />
    </div>
  );
}
