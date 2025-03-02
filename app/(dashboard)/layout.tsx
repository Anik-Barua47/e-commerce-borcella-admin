import { LeftSideBar } from "@/components/left-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-screen">
      <LeftSideBar />
      <div className="flex-1">
        <SidebarTrigger className="border" />
        {children}
      </div>
    </div>
  );
}
