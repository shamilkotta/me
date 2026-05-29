import Link from "nlite/link";

export function BackLink() {
  return (
    <Link
      className="mb-10 inline-block text-[0.8125rem] text-muted no-underline hover:text-fg"
      href="/"
    >
      ← home
    </Link>
  );
}
