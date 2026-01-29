"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard/calculator", label: "수익률 계산", icon: "📊" },
  { href: "/dashboard/settings", label: "설정", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <aside
      className="w-56 min-h-screen flex flex-col border-r border-[var(--card-border)]"
      style={{ background: "var(--sidebar)" }}
    >
      <div className="p-5 border-b border-[var(--card-border)]">
        <Link href="/dashboard" className="text-lg font-semibold text-[var(--foreground)] tracking-tight">
          수익률 계산기
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-[var(--shadow-sm)]"
                  : "text-[var(--muted)] hover:bg-[var(--primary-light)]/40 hover:text-[var(--foreground)]"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-[var(--card-border)]">
        {user?.email && (
          <p className="text-xs text-[var(--muted)] truncate px-3 py-1 mb-2" title={user.email}>
            {user.email}
          </p>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--foreground)] transition"
        >
          <span className="text-base">🚪</span>
          로그아웃
        </button>
      </div>
    </aside>
  );
}
