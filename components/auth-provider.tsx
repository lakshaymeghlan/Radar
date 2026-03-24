"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  image?: string;
  bio?: string;
  tagline?: string;
  location?: string;
  role?: 'builder' | 'explorer';
  // Rich Profile Fields
  links?: Array<{ label: string; url: string }>;
  achievements?: string;
  status?: 'student' | 'professional' | string;
  projects?: Array<{ title: string; url: string; description?: string }>;
  education?: string;
  identityTags?: string[];
  socials?: {
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

import { SessionProvider, useSession, signOut } from "next-auth/react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthInnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleRoleSwitch = async (e: any) => {
      const newRole = e.detail;
      if (user && user.role !== newRole) {
        // Optimistic update
        setUser({ ...user, role: newRole });
        
        try {
          await fetch('/api/auth/onboarding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole }),
          });
        } catch (err) {
          console.error("Failed to switch role on server:", err);
        }
      }
    };

    window.addEventListener('switch-role', handleRoleSwitch);
    return () => window.removeEventListener('switch-role', handleRoleSwitch);
  }, [user]);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: (session.user as any).id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || undefined,
        image: session.user.image || undefined,
        role: (session.user as any).role || undefined,
      } as User);
    } else {
      setUser(null);
    }
  }, [session]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
  };

  const checkSession = async () => {
    // This is now handled by useSession from next-auth
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading: status === "loading", 
      login, 
      logout, 
      checkSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthInnerProvider>{children}</AuthInnerProvider>
    </SessionProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
