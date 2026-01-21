import { createClient } from "@supabase/supabase-js";

const sanitize = (value = "") => value.trim().replace(/^['"]|['"]$/g, "");

const supabaseUrl = sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = sanitize(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const isBrowser = typeof window !== "undefined";

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const supabase =
  isBrowser && isValidUrl(supabaseUrl) && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
