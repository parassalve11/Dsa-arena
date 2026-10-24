import { notFound } from "next/navigation";
import { bySlug } from "@/data/catalog";
import { hasProblem, problems } from "@/data/problems";
import { MarathonPlay } from "@/components/marathon/MarathonPlay";

export const dynamicParams = false;

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `Marathon · ${bySlug[slug]?.title ?? ""}` };
}

export default async function MarathonPlayPage({ params }) {
  const { slug } = await params;
  if (!hasProblem(slug)) notFound();
  return <MarathonPlay slug={slug} />;
}
