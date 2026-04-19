import type { EditorialRepository } from "blog-kit-core";
import { createStarterLocalAdapter } from "./local-editorial";
import { getStarterDataBackend } from "../runtime-config";
import { createStarterAdapter, hasSupabaseConfig } from "../supabase";

export type StarterEditorialSource = "local" | "supabase";

export function getStarterEditorialSource(): StarterEditorialSource {
  const configured = getStarterDataBackend();

  if (configured === "local") {
    return "local";
  }

  if (configured === "supabase") {
    return "supabase";
  }

  return hasSupabaseConfig() ? "supabase" : "local";
}

export function getStarterEditorialSourceLabel(
  source: StarterEditorialSource
) {
  return source === "supabase"
    ? "Supabase-backed mode"
    : "Local filesystem mode";
}

export function createStarterEditorialRepository(): {
  source: StarterEditorialSource;
  editorial: EditorialRepository;
} {
  const source = getStarterEditorialSource();

  if (source === "local") {
    return {
      source,
      editorial: createStarterLocalAdapter().editorial
    };
  }

  const adapter = createStarterAdapter();

  if (!adapter?.editorial) {
    throw new Error(
      "Supabase editorial mode was requested, but the Supabase client is not configured."
    );
  }

  return {
    source,
    editorial: adapter.editorial
  };
}
