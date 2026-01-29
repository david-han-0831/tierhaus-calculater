"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function LoginContent() {
  const { user, userRole, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUnauthorized = searchParams.get("error") === "unauthorized";

  useEffect(() => {
    if (loading) return;
    if (user && userRole === "admin") {
      router.replace("/dashboard");
    }
  }, [user, userRole, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--muted)] text-sm">잠시만 기다려 주세요.</div>
      </div>
    );
  }

  if (user && userRole === "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-sm rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-8 shadow-[var(--shadow-md)]">
        <h1 className="text-xl font-semibold text-[var(--foreground)] tracking-tight text-center">
          수익률 계산기
        </h1>
        {isUnauthorized ? (
          <p className="text-sm text-red-600 text-center mt-2 mb-8">
            관리자 권한이 없습니다. 사용 권한이 필요하면 관리자에게 문의하세요.
          </p>
        ) : (
          <p className="text-sm text-[var(--muted)] text-center mt-2 mb-8">
            로그인 후 이용해 주세요.
          </p>
        )}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full rounded-[var(--radius)] bg-[var(--primary)] text-white py-3 px-4 text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google로 로그인
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
          <div className="text-[var(--muted)] text-sm">잠시만 기다려 주세요.</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
