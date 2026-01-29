"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardGuard({ children }: { children: ReactNode }) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (userRole !== "admin") {
      router.replace("/login?error=unauthorized");
    }
  }, [user, userRole, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--muted)] text-sm">로그인 확인 중...</div>
      </div>
    );
  }

  if (!user || userRole !== "admin") {
    return null;
  }

  return <>{children}</>;
}
