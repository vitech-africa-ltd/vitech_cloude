import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Profile, Role } from "../types";
import { config } from "../config";
import { supabase } from "../lib/supabase/client";

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: Profile = {
  id: "demo-user-id",
  user_id: "demo-user-id",
  full_name: "Vab Idriss",
  email: "vab@vitechafrica.com",
  avatar_url: null,
  role: "ADMIN" as Role,
  storage_quota_bytes: 10 * 1024 * 1024 * 1024,
  storage_used_bytes: 7.2 * 1024 * 1024 * 1024,
  is_suspended: false,
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (config.isDemoMode) {
      const demoSession = localStorage.getItem("vitech-demo-session");
      if (demoSession === "true") setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        if (profile) setUser(profile as Profile);
      }
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        if (profile) setUser(profile as Profile);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (config.isDemoMode) {
      // Demo mode: accept any credentials
      if (email && password.length >= 6) {
        setUser(DEMO_USER);
        localStorage.setItem("vitech-demo-session", "true");
        return {};
      }
      return { error: "Invalid credentials" };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (config.isDemoMode) {
      setUser({ ...DEMO_USER, full_name: fullName, email });
      localStorage.setItem("vitech-demo-session", "true");
      return {};
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    if (config.isDemoMode) {
      setUser(null);
      localStorage.removeItem("vitech-demo-session");
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    if (config.isDemoMode) {
      setUser((prev) => (prev ? { ...prev, ...data } : null));
      return;
    }
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("user_id", user.user_id);
    if (!error) setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, [user]);

  const refreshUser = useCallback(async () => {
    if (config.isDemoMode) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      if (profile) setUser(profile as Profile);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
