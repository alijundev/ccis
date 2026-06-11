import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getSession } from "@/lib/auth";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const userName = session?.name || "Budi Santoso";
  const userMajor = session?.major || "Informatika";
  const userNim = session?.nim || "2109876543";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar - handles desktop + mobile drawer internally */}
      <Sidebar role="STUDENT" userName={userName} userMajor={userMajor} />
      
      {/* Main Content Area */}
      <div className="flex flex-col md:pl-[260px] min-h-screen">
        <Header 
          title="Portal Mahasiswa" 
          role="STUDENT" 
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
