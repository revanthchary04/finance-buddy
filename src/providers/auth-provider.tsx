"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { logAuthEvent } from "@/features/admin/actions/logs.actions";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
  initialProfile = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialProfile?: any | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<any | null>(initialProfile);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    const supabase = createClient();

    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
            
          console.log('fetchSession profile data:', data);
          if (error) console.log('fetchSession profile error:', error);
            
          if (data) {
            setProfile(data);
            // Fallback: sync stale JWT with DB state
            session.user.app_metadata = {
              ...session.user.app_metadata,
              user_role: data.role
            };
          }
          setUser(session.user);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          if (event === "SIGNED_IN") {
            logAuthEvent(session.user.id, "SIGNED_IN").catch(console.error);
          }
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
            
          console.log('onAuthStateChange profile data:', data);
          if (error) console.log('onAuthStateChange profile error:', error);
            
          if (data) {
            setProfile(data);
            // Fallback: sync stale JWT with DB state
            session.user.app_metadata = {
              ...session.user.app_metadata,
              user_role: data.role
            };
          }
          setUser(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (user) {
      // Log the sign out event before actually signing out
      await logAuthEvent(user.id, "SIGNED_OUT").catch(console.error);
    }
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  console.log('profile:', profile);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
