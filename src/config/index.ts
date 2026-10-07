// VITECH Cloud — Configuration

export const config = {
  appName: "VITECH Cloud",
  appTagline: "Your files. Your cloud. Your control.",
  company: "VITECH Africa",
  domain: import.meta.env.VITE_APP_DOMAIN || "cloud.vitechafrica.com",
  defaultQuotaBytes: 10 * 1024 * 1024 * 1024, // 10 GB
  maxFileSizeBytes: 5 * 1024 * 1024 * 1024, // 5 GB
  maxUploadConcurrent: 3,
  trashRetentionDays: 30,
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  },
  isDemoMode: !import.meta.env.VITE_SUPABASE_URL,
};

export const SITE_URL = typeof window !== "undefined"
  ? window.location.origin
  : "https://cloud.vitechafrica.com";
