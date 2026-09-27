import type { PropsWithChildren } from "react";

import "./nlite.css";

export default function NliteLayout({ children }: PropsWithChildren) {
  return <div className="nlite-root">{children}</div>;
}
