import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const userName = session?.name || "Admin Academic";
  const userMajor = session?.major || "Lembaga Penjamin Mutu";
  const userNim = session?.nim || "admin";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar - handles desktop + mobile drawer internally */}
      <Sidebar role="ADMIN" userName={userName} userMajor={userMajor} />
      
      {/* Main Content Area */}
      <div className="flex flex-col md:pl-[260px] min-h-screen">
        <Header 
          title="Admin Panel" 
          role="ADMIN" 
          userName={userName} 
          userMajor={userMajor} 
          userNim={userNim} 
        />
        <main className="flex-1 p-4 md:p-8 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  );
}
