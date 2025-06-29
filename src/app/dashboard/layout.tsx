import Sidebar from "@/ui/layout/sidebar";

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen relative">
          {/* Sidebar */}
          <aside className="fixed top-0 left-0 bottom-0 w-56 bg-[#2F2F2F] p-4">
            <Sidebar />
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6 bg-base-100 ml-64">
            {children}
          </main>
        </div>
  );

}