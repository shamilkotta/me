import { MapPin } from "lucide-react";

type MarkLocationProps = {
  location: string;
  className?: string;
};

export function MarkLocation({ location, className = "" }: MarkLocationProps) {
  return (
    <p className={`flex items-center gap-1 text-[0.6875rem] text-muted ${className}`}>
      <MapPin aria-hidden className="size-3 shrink-0" />
      <span className="truncate">{location}</span>
    </p>
  );
}
