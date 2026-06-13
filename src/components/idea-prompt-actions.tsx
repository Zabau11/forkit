"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IdeaPromptActionsProps = {
  prompt: string;
};

export function IdeaPromptActions({ prompt }: IdeaPromptActionsProps) {
  const [copied, setCopied] = useState(false);
  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function copyPromptInBackground() {
    void navigator.clipboard.writeText(prompt).catch(() => {
      // The URL carries the prompt; clipboard is only a fallback.
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        className="font-mono text-[11px]"
        onClick={copyPrompt}
      >
        {copied ? (
          <Check className="size-3" aria-hidden="true" />
        ) : (
          <Copy className="size-3" aria-hidden="true" />
        )}
        {copied ? "copied" : "copy prompt"}
      </Button>
      <a
        href={claudeUrl}
        target="_blank"
        rel="noreferrer"
        onClick={copyPromptInBackground}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "font-mono text-[11px]",
        )}
      >
        open Claude
        <ExternalLink className="size-3" aria-hidden="true" />
      </a>
    </div>
  );
}
