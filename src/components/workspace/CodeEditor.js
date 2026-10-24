"use client";

import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { LoaderCircle } from "lucide-react";
import { ARENA_THEME, defineArenaTheme, editorOptions } from "@/lib/monacoTheme";

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 text-[0.9rem] text-muted">
      <LoaderCircle className="h-4 w-4 animate-spin" /> Loading editor…
    </div>
  );
}

/**
 * Monaco editor with the arena theme. `commands` holds the latest
 * { run, submit, save } handlers; keyboard shortcuts call through a ref so the
 * editor never needs to be re-created.
 */
export function CodeEditor({ path, language, value, onChange, fontSize, tabSize, commands }) {
  const cmdRef = useRef(commands);
  const editorRef = useRef(null);

  useEffect(() => {
    cmdRef.current = commands;
  }, [commands]);

  useEffect(() => {
    editorRef.current?.updateOptions({ fontSize, lineHeight: Math.round(fontSize * 1.6), tabSize });
  }, [fontSize, tabSize]);

  function onMount(editor, monaco) {
    editorRef.current = editor;
    const { KeyMod, KeyCode } = monaco;
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.Quote, () => cmdRef.current?.run?.());
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.Enter, () => cmdRef.current?.submit?.());
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => cmdRef.current?.save?.());
    editor.focus();
  }

  return (
    <Editor
      path={path}
      language={language}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      theme={ARENA_THEME}
      beforeMount={defineArenaTheme}
      onMount={onMount}
      loading={<Loading />}
      options={editorOptions({ fontSize, tabSize })}
    />
  );
}

/** Read-only, auto-height Monaco for reference solutions. */
export function CodeViewer({ path, language, value, fontSize = 14 }) {
  const lines = (value || "").split("\n").length;
  const lineHeight = Math.round(fontSize * 1.6);
  const height = Math.min(lines * lineHeight + 26, 640);
  return (
    <div style={{ height }} className="overflow-hidden rounded-md">
      <Editor
        path={path}
        language={language}
        value={value}
        theme={ARENA_THEME}
        beforeMount={defineArenaTheme}
        loading={<Loading />}
        options={{ ...editorOptions({ fontSize, readOnly: true }), lineNumbers: "on", folding: false, scrollBeyondLastLine: false }}
      />
    </div>
  );
}
