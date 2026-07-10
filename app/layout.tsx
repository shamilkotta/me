import type { PropsWithChildren } from "react";

import "@fontsource-variable/geist-mono/wght.css";
import geistMonoLatin from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url";
import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { Metadata } from "nlite";

export const metadata: Metadata = {
  title: {
    default: "shamil",
    template: "%s | shamil",
  },
  links: [
    {
      rel: "preload",
      href: geistMonoLatin,
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
  ],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-[800px] px-6 pb-16 pt-12 text-fg">
      {children}
      <SiteFooter />
    </div>
  );
}
