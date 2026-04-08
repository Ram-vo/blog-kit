import { createClient } from "@supabase/supabase-js";
import {
  createSupabaseAdapter,
  type SupabaseClientLike
} from "blog-kit-supabase";

function getEnv(name: string) {
  const value = process.env[name];
  return value && value.length > 0 ? value : null;
}

export function hasSupabaseConfig() {
  return Boolean(
    getEnv("NEXT_PUBLIC_SUPABASE_URL") &&
      getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY")
  );
}

export function createSupabaseClient(): SupabaseClientLike | null {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");

  if (!url || !key) {
    return null;
  }

  return createClient(url, key) as unknown as SupabaseClientLike;
}

export function createStarterAdapter() {
  const client = createSupabaseClient();
  return client ? createSupabaseAdapter({ client }) : null;
}
