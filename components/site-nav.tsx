import Link from "nlite/link";
import { ArrowLeft } from "lucide-react";

import { CopyEmail } from "@/components/copy-email";
import { pageLinks, socialLinks } from "@/lib/links";

type SiteNavProps = {
  className?: string;
  showHome?: boolean;
};

export function SiteNav({ className = "", showHome = false }: SiteNavProps) {
  const items: Array<{ href: string; label: string; external?: boolean }> = [
    ...(showHome ? [{ href: "/", label: "home" }] : []),
    ...(showHome ? pageLinks : []),
    ...(!showHome ? socialLinks : []),
  ];

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
            >
              {item.label}
            </a>
          ) : (
            <Link
              className={
                item.label === "home"
                  ? "inline-flex items-center gap-1 text-muted no-underline transition-colors hover:text-fg"
                  : "text-muted no-underline transition-colors hover:text-fg"
              }
              href={item.href}
            >
              {item.label === "home" ? (
                <ArrowLeft aria-hidden className="size-[1em] shrink-0" />
              ) : null}
              {item.label}
            </Link>
          )}
        </div>
      ))}
      {!showHome ? (
        <span className="inline-flex items-baseline">
          <span className="mr-[0.35rem] text-muted">·</span>
          <CopyEmail />
        </span>
      ) : null}
    </nav>
  );
}
