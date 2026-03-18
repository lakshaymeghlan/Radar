"use client";

import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useRequireAuth = () => {
  const { user } = useAuth();
  
  const requireAuth = (action: () => void, message: string = "Sign in to interact with the ecosystem") => {
    if (user) {
      action();
      return true;
    }

    toast.info(message, {
      description: "Join the community to unlock full access.",
      action: {
        label: "Sign In",
        onClick: () => {
          // This assumes we can trigger the AuthModal. 
          // Since AuthModal is managed by state in Navbar, we might need a global state or a search param.
          // Let's use a search param to trigger it if we want to be simple, 
          // or just redirect to a login page if we had one.
          // But the requirement says "Avoid aggressive modals", so let's try to trigger the existing modal.
          window.dispatchEvent(new CustomEvent("open-auth-modal"));
        },
      },
      duration: 5000,
    });
    return false;
  };

  const requireRole = (role: "builder" | "explorer", action: () => void, message: string) => {
    if (!user) {
      return requireAuth(action);
    }

    if (user.role === role) {
      action();
      return true;
    }

    toast.error("Access Restricted", {
      description: message || `This action is only available for ${role}s.`,
    });
    return false;
  };

  return { requireAuth, requireRole };
};
