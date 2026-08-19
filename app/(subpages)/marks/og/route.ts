import { servePageOg } from "@/lib/page-og-handler";

export async function GET() {
  return servePageOg("marks");
}
