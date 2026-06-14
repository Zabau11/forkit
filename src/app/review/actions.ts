"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  clearReviewAdminCookie,
  createReviewAdminClient,
  isReviewAdminAuthenticated,
  reviewStatuses,
  setReviewAdminCookie,
  validateReviewPassword,
  type ReviewStatus,
} from "@/lib/review-admin";

export async function loginReviewAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!validateReviewPassword(password)) {
    redirect("/review?error=invalid");
  }

  await setReviewAdminCookie();
  redirect("/review");
}

export async function logoutReviewAdmin() {
  await clearReviewAdminCookie();
  redirect("/review");
}

export async function updateReviewIdea(formData: FormData) {
  if (!(await isReviewAdminAuthenticated())) {
    redirect("/review");
  }

  const ideaId = getRequiredString(formData, "ideaId");
  const status = normalizeStatus(getRequiredString(formData, "reviewStatus"));
  const supabase = createReviewAdminClient();
  const viabilityScore = normalizeViabilityScore(formData.get("viabilityScore"));

  const { error } = await supabase
    .from("startup_fork_ideas")
    .update({
      title: getRequiredString(formData, "title"),
      niche: getRequiredString(formData, "niche"),
      problem: getOptionalString(formData.get("problem")),
      pricing: getOptionalString(formData.get("pricing")),
      viability_score: viabilityScore,
      review_status: status,
      is_published: formData.get("isPublished") === "on",
      is_featured: formData.get("isFeatured") === "on",
      review_notes: getOptionalString(formData.get("reviewNotes")),
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", ideaId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/review");
  revalidatePath("/");
  revalidatePath("/startups");
}

function getRequiredString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

function getOptionalString(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue || null;
}

function normalizeStatus(value: string): ReviewStatus {
  if (!reviewStatuses.includes(value as ReviewStatus)) {
    throw new Error("Invalid review status.");
  }

  return value as ReviewStatus;
}

function normalizeViabilityScore(value: FormDataEntryValue | null) {
  if (value === null || value === "") {
    return null;
  }

  const score = Number(value);

  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error("Viability score must be 1-5.");
  }

  return score;
}
