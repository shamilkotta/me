import type { PropsWithChildren } from "react";
import "@fontsource-variable/geist-mono/wght.css";
import geistMonoLatin from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url";
import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteJsonLd } from "@/components/site-json-ld";
import { siteName, siteUrl } from "@/lib/links";
import { Metadata } from "nlite";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  applicationName: siteName,
  openGraph: {
    siteName,
    type: "website",
    locale: "en_US",
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
    <div className="mx-auto max-w-200 px-6 pb-16 pt-12 text-fg">
      <SiteJsonLd />
      {children}
      <SiteFooter />
    </div>
  );
}
