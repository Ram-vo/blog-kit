export interface SupabaseAdapterOptions {
  url: string;
  anonKey: string;
}

export function createSupabaseAdapter(_options: SupabaseAdapterOptions) {
  throw new Error("Supabase adapter is not implemented yet.");
}
