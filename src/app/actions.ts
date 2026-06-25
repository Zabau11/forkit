"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase";

export async function adjustForkIdeaVote(
  ideaId: string,
  upvoteDelta: number,
  downvoteDelta: number,
) {
  if (upvoteDelta === 0 && downvoteDelta === 0) return;

  const supabase = createSupabaseServerClient();

  if (!supabase) return;

  await supabase.rpc("adjust_fork_idea_vote", {
    idea_id: ideaId,
    upvote_delta: upvoteDelta,
    downvote_delta: downvoteDelta,
  });
}

export async function suggestStartup(formData: FormData) {
  const startupName = String(formData.get("startup_name") ?? "")
    .trim()
    .slice(0, 120);

  if (startupName.length < 2) {
    return;
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("startup_suggestions")
    .insert({ startup_name: startupName });

  if (!error) {
    revalidatePath("/");
  }
}
