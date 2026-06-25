"use client";

import { useEffect, useState, useTransition } from "react";

import { adjustForkIdeaVote } from "@/app/actions";
import { cn } from "@/lib/utils";

type VoteDirection = 1 | -1 | null;

const STORAGE_KEY = "forkit:votes_v1";

function readStoredVotes(): Record<string, VoteDirection> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeStoredVotes(votes: Record<string, VoteDirection>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
}

export function ForkIdeaVoteButtons({
  ideaId,
  initialUpvotes,
  initialDownvotes,
}: {
  ideaId: string;
  initialUpvotes: number;
  initialDownvotes: number;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [myVote, setMyVote] = useState<VoteDirection>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const stored = readStoredVotes();
    setMyVote(stored[ideaId] ?? null);
  }, [ideaId]);

  function handleVote(direction: 1 | -1) {
    const isUndo = myVote === direction;
    const newVote: VoteDirection = isUndo ? null : direction;

    let upvoteDelta = 0;
    let downvoteDelta = 0;

    if (myVote === 1) upvoteDelta -= 1;
    if (myVote === -1) downvoteDelta -= 1;
    if (newVote === 1) upvoteDelta += 1;
    if (newVote === -1) downvoteDelta += 1;

    setUpvotes((u) => Math.max(0, u + upvoteDelta));
    setDownvotes((d) => Math.max(0, d + downvoteDelta));
    setMyVote(newVote);

    const stored = readStoredVotes();
    if (newVote === null) {
      delete stored[ideaId];
    } else {
      stored[ideaId] = newVote;
    }
    writeStoredVotes(stored);

    startTransition(async () => {
      await adjustForkIdeaVote(ideaId, upvoteDelta, downvoteDelta);
    });
  }

  const netScore = upvotes - downvotes;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        onClick={() => handleVote(1)}
        disabled={isPending}
        aria-label="Upvote this idea"
        aria-pressed={myVote === 1}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded transition-colors disabled:opacity-50",
          myVote === 1
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 5L5 1L1 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <span className="font-mono text-[11px] leading-none tabular-nums text-muted-foreground">
        {netScore}
      </span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        disabled={isPending}
        aria-label="Downvote this idea"
        aria-pressed={myVote === -1}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded transition-colors disabled:opacity-50",
          myVote === -1
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
