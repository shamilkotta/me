import type { PropsWithChildren } from "react";
import "@fontsource-variable/geist/wght.css";
import "@fontsource-variable/geist-mono/wght.css";
import geistLatin from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import geistMonoLatin from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url";
import "./globals.css";

import { absoluteUrl, ogImage, siteDescription, siteName, siteTitle, siteUrl } from "@/lib/links";
import { themeInitScript } from "@/lib/theme";
import { Metadata } from "nlite";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Shamil Kotta", url: siteUrl }],
  creator: "Shamilkotta",
  publisher: "Shamilkotta",
  keywords: ["Shamil", "shamilkotta", "software engineer", "developer"],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: absoluteUrl("/"),
    siteName,
    type: "website",
    locale: "en_US",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@shamilkotta",
    site: "@shamilkotta",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  links: [
    {
      rel: "preload",
      href: geistLatin,
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
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
    <>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      {children}
    </>
  );
}
