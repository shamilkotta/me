import { siteDescription, siteName, siteUrl } from "@/lib/links";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  alternateName: ["shamil kotta", "shamilkotta"],
  description: siteDescription,
  url: `${siteUrl}/`,
  image: `${siteUrl}/shamilkotta.png`,
};

export function SiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
    />
  );
}
