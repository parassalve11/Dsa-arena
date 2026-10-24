"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, Lightbulb, Building2 } from "lucide-react";
import { DifficultyBadge, Pill, WeightBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { inputEntries } from "@/lib/runner/harness";
import { show } from "@/lib/format";
import { StatusIcon } from "@/components/dashboard/StatusIcon";

// "10^4" -> 10⁴ style superscripts in constraints.
function Constraint({ text }) {
  const parts = text.split(/(\d+\^-?\d+)/g);
  return (
    <code className="font-mono text-[0.88em]">
      {parts.map((p, i) => {
        const m = p.match(/^(\d+)\^(-?\d+)$/);
        return m ? (
          <span key={i}>
            {m[1]}
            <sup>{m[2]}</sup>
          </span>
        ) : (
          <span key={i}>{p}</span>
        );
      })}
    </code>
  );
}

function ExampleBlock({ index, example, harness }) {
  return (
    <div className="mb-5">
      <h3 className="mb-2 text-[0.98rem] font-semibold text-text">Example {index + 1}</h3>
      <div className="rounded-lg border-l-2 border-border-strong bg-bg/70 px-4 py-3 font-mono text-[0.86rem] leading-7">
        <div className="flex gap-2">
          <span className="shrink-0 font-sans font-semibold text-text">Input:</span>
          <span className="min-w-0 break-all text-text-soft">
            {inputEntries(harness, example.input)
              .map(([k, v]) => `${k} = ${show(v, 600)}`)
              .join(", ")}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-sans font-semibold text-text">Output:</span>
          <span className="min-w-0 break-all text-text-soft">{show(example.output, 600)}</span>
        </div>
        {example.explanation && (
          <div className="flex gap-2">
            <span className="shrink-0 font-sans font-semibold text-text">Explanation:</span>
            <span className="min-w-0 font-sans text-[0.92rem] text-text-soft">{example.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function DescriptionTab({ problem, status, onShowAnswer, answerLocked }) {
  return (
    <div className="px-5 py-5 sm:px-6">
      <div className="flex items-start gap-3">
        <h1 className="text-[1.4rem] font-semibold leading-snug tracking-tight text-text">
          {problem.id}. {problem.title}
        </h1>
        {status && (
          <span className="mt-1.5">
            <StatusIcon status={status} className="h-5 w-5" />
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DifficultyBadge value={problem.difficulty} />
        <WeightBadge value={problem.weightage} />
        <Pill color="var(--accent-soft)">{problem.topic}</Pill>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[0.85rem] text-muted">
        <Building2 className="h-4 w-4" />
        {problem.companies.map((c) => (
          <span key={c} className="rounded-md border border-border bg-panel-2 px-2 py-0.5 text-text-soft">
            {c}
          </span>
        ))}
      </div>

      <a
        href={problem.leetcodeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-border bg-panel-2 px-3 text-[0.9rem] font-medium text-accent-soft hover:border-accent hover:text-text"
      >
        <ExternalLink className="h-4 w-4" /> Open on LeetCode
      </a>

      <div className="prose-arena mt-6 text-[1rem]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
      </div>

      <div className="mt-6">
        {problem.examples.map((ex, i) => (
          <ExampleBlock key={i} index={i} example={ex} harness={problem.harness} />
        ))}
      </div>

      {problem.constraints.length > 0 && (
        <div className="mt-2">
          <h3 className="mb-2 text-[0.98rem] font-semibold text-text">Constraints</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-[0.92rem] text-text-soft marker:text-muted">
            {problem.constraints.map((c, i) => (
              <li key={i}>
                <Constraint text={c} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {problem.followUp && (
        <p className="mt-5 text-[0.95rem] text-text-soft">
          <span className="font-semibold text-text">Follow-up: </span>
          {problem.followUp}
        </p>
      )}

      <div className="mt-8 border-t border-border pt-5">
        {answerLocked ? (
          <p className="text-[0.9rem] text-muted">Answers are locked while a marathon is running.</p>
        ) : (
          <Button onClick={onShowAnswer}>
            <Lightbulb className="h-4 w-4 text-medium" /> Show Answer
          </Button>
        )}
      </div>
    </div>
  );
}
