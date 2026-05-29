import Link from "nlite/link";

import { CopyEmail } from "@/components/copy-email";
import { pageLinks, socialLinks } from "@/lib/links";

type SiteNavProps = {
  className?: string;
  showHome?: boolean;
};

const linkClass =
  "text-muted no-underline transition-colors hover:text-fg";

export function SiteNav({ className = "", showHome = false }: SiteNavProps) {
  const items: Array<{ href: string; label: string; external?: boolean }> = [
    ...(showHome ? [{ href: "/", label: "home" }] : []),
    ...pageLinks,
    ...(!showHome ? socialLinks : []),
  ];

  return (
    <nav
      aria-label="Site"
      className={`flex flex-wrap items-baseline gap-x-[0.35rem] gap-y-1 text-[0.8125rem] ${className}`}
    >
      {items.map((item, index) => (
        <span className="inline-flex items-baseline" key={item.label}>
          {index > 0 ? <span className="mr-[0.35rem] text-muted">·</span> : null}
          {item.external ? (
            <a className={linkClass} href={item.href}>
              {item.label}
            </a>
          ) : (
            <Link className={linkClass} href={item.href}>
              {item.label}
            </Link>
          )}
        </span>
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
