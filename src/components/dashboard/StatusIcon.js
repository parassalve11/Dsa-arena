import { CircleCheck, CircleDashed } from "lucide-react";

export function StatusIcon({ status, className = "h-[18px] w-[18px]" }) {
  if (status === "solved") return <CircleCheck className={`${className} text-success`} aria-label="Solved" />;
  if (status === "attempted") return <CircleDashed className={`${className} text-medium`} aria-label="Attempted" />;
  return <span className={`inline-block ${className}`} aria-label="Not started" />;
}
