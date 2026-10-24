import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <LogoMark className="mb-5 h-12 w-12 opacity-80" />
      <p className="text-[0.9rem] font-medium uppercase tracking-widest text-accent-soft">404</p>
      <h1 className="mt-2 text-2xl font-semibold">This page does not exist</h1>
      <p className="mt-2 max-w-sm text-muted">The problem or page you were looking for is not part of the sheet.</p>
      <Link href="/" className="mt-6 inline-flex h-10 items-center rounded-md bg-accent px-4 font-medium text-white hover:bg-accent-hover">
        Back to problems
      </Link>
    </main>
  );
}
