import { Signature } from "./signature";

export function SiteFooter() {
  return (
    <footer className="mt-16 flex flex-col items-start gap-4">
      <Signature className="block h-14 w-auto text-muted" />
      <p className="text-xs text-muted">© {new Date().getFullYear()} shamilkotta</p>
    </footer>
  );
}
