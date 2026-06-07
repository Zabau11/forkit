"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase";

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
