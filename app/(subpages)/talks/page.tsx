import { talks } from "@/lib/content";

export default function TalksPage() {
  return (
    <>
      <h1 className="mb-8 text-base font-semibold tracking-normal">talks</h1>

      <div>
        {talks.map((talk) => (
          <a
            className="block border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline first:border-t hover:text-muted"
            href="#"
            key={talk.date}
          >
            <span className="mr-1 inline-block min-w-[6.5rem] tabular-nums text-muted">
              {talk.date}
            </span>
            {talk.title}
          </a>
        ))}
      </div>
    </>
  );
}
