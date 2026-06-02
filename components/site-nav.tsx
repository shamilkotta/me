import Link from "nlite/link";
import { ArrowLeft } from "lucide-react";

import { CopyEmail } from "@/components/copy-email";
import { navLinkWithArrow, navLinksForVariant, type SiteNavVariant } from "@/lib/links";

type SiteNavProps = {
  className?: string;
  variant?: SiteNavVariant;
};

export function SiteNav({ className = "", variant = "home" }: SiteNavProps) {
  const items = navLinksForVariant(variant);
  const arrowLabel = navLinkWithArrow(variant);

  return (
    <nav
      aria-label="Site"
      className={`flex flex-wrap items-center gap-x-[0.35rem] gap-y-1 text-[0.8125rem] ${className}`}
    >
      {items.map((item, index) => (
        <div className="flex items-center" key={item.label}>
          {index > 0 ? <span className="mr-[0.35rem] text-muted">·</span> : null}
          {item.external ? (
            <a
              className={"text-muted no-underline transition-colors hover:text-fg"}
              href={item.href}
              target="_blank"
            >
              {item.label}
            </a>
          ) : (
            <Link
              className={
                item.label === arrowLabel
                  ? "inline-flex items-center gap-1 text-muted no-underline transition-colors hover:text-fg"
                  : "text-muted no-underline transition-colors hover:text-fg"
              }
              href={item.href}
            >
              {item.label === arrowLabel ? (
                <ArrowLeft aria-hidden className="size-[1em] shrink-0" />
              ) : null}
              {item.label}
            </Link>
          )}
        </div>
      ))}
      {variant === "home" ? (
        <span className="inline-flex items-baseline">
          <span className="mr-[0.35rem] text-muted">·</span>
          <CopyEmail />
        </span>
      ) : null}
    </nav>
  );
}
