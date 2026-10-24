import { notFound } from "next/navigation";
import { bySlug } from "@/data/catalog";
import { hasProblem, problems } from "@/data/problems";
import { Workspace } from "@/components/workspace/Workspace";

export const dynamicParams = false;

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = bySlug[slug];
  return { title: p ? `${p.id}. ${p.title}` : "Problem not found" };
}

export default async function ProblemPage({ params }) {
  const { slug } = await params;
  if (!hasProblem(slug)) notFound();
  return <Workspace slug={slug} />;
}
