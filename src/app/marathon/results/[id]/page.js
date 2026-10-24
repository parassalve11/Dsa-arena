import { MarathonResults } from "@/components/marathon/MarathonResults";

export const metadata = { title: "Marathon result" };

export default async function MarathonResultPage({ params }) {
  const { id } = await params;
  return <MarathonResults id={id} />;
}
