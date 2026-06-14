import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const reviewStatuses = ["pending", "approved", "rejected"] as const;

export type ReviewStatus = (typeof reviewStatuses)[number];

export type ReviewStatusFilter = ReviewStatus | "all";

export type ReviewIdea = {
  id: string;
  title: string;
  niche: string;
  problem: string | null;
  whyItWorks: string | null;
  mvp: string | null;
  goToMarket: string | null;
  pricing: string | null;
  viabilityScore: number | null;
  reviewStatus: ReviewStatus;
  reviewNotes: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  startup: {
    id: string;
    name: string;
    slug: string;
    category: string;
  } | null;
};

type ReviewIdeaRow = {
  id: string;
  title: string;
  niche: string;
  problem: string | null;
  why_it_works: string | null;
  mvp: string | null;
  go_to_market: string | null;
  pricing: string | null;
  viability_score: number | null;
  review_status: ReviewStatus;
  review_notes: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  startup: {
    id: string;
    name: string;
    slug: string;
    category: string;
  } | null;
};

const REVIEW_COOKIE_NAME = "forkit_review_admin";
const REVIEW_COOKIE_MESSAGE = "forkit-review-admin";

export function getReviewPassword() {
  return process.env.FORKIT_REVIEW_PASSWORD ?? "";
}

export function isReviewConfigured() {
  return Boolean(getReviewPassword());
}

export function normalizeReviewStatusFilter(
  value: string | undefined,
): ReviewStatusFilter {
  if (value === "all" || reviewStatuses.includes(value as ReviewStatus)) {
    return value as ReviewStatusFilter;
  }

  return "all";
}

export async function isReviewAdminAuthenticated() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(REVIEW_COOKIE_NAME)?.value;

  if (!cookieValue || !isReviewConfigured()) {
    return false;
  }

  return secureCompare(cookieValue, createReviewCookieValue());
}

export async function setReviewAdminCookie() {
  const cookieStore = await cookies();

  cookieStore.set(REVIEW_COOKIE_NAME, createReviewCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/review",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearReviewAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(REVIEW_COOKIE_NAME);
}

export function validateReviewPassword(password: string) {
  const configuredPassword = getReviewPassword();

  return Boolean(configuredPassword) && secureCompare(password, configuredPassword);
}

export function createReviewAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getReviewIdeas(
  status: ReviewStatusFilter,
): Promise<ReviewIdea[]> {
  const supabase = createReviewAdminClient();
  let query = supabase
    .from("startup_fork_ideas")
    .select(
      `
        id,
        title,
        niche,
        problem,
        why_it_works,
        mvp,
        go_to_market,
        pricing,
        viability_score,
        review_status,
        review_notes,
        is_published,
        is_featured,
        created_at,
        startup:startups (
          id,
          name,
          slug,
          category
        )
      `,
    )
    .order("created_at", { ascending: false })
    .limit(160);

  if (status !== "all") {
    query = query.eq("review_status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as ReviewIdeaRow[]).map(mapReviewIdeaRow);
}

function mapReviewIdeaRow(row: ReviewIdeaRow): ReviewIdea {
  return {
    id: row.id,
    title: row.title,
    niche: row.niche,
    problem: row.problem,
    whyItWorks: row.why_it_works,
    mvp: row.mvp,
    goToMarket: row.go_to_market,
    pricing: row.pricing,
    viabilityScore: row.viability_score,
    reviewStatus: row.review_status,
    reviewNotes: row.review_notes,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    startup: row.startup,
  };
}

function createReviewCookieValue() {
  return createHmac("sha256", getReviewPassword())
    .update(REVIEW_COOKIE_MESSAGE)
    .digest("hex");
}

function secureCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}
