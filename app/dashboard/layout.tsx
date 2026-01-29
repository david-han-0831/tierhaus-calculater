import Sidebar from "@/components/layout/Sidebar";
import DashboardGuard from "@/components/auth/DashboardGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </DashboardGuard>
  );
}
