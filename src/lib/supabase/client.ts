import { createClient } from "@supabase/supabase-js";
import { config } from "../../config";

export const supabase = config.isDemoMode
  ? createClient("https://placeholder.supabase.co", "placeholder-key", { auth: { persistSession: false } })
  : createClient(config.supabase.url, config.supabase.anonKey);
