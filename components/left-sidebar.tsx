"use client";

import dynamic from "next/dynamic"; // ✅ Import dynamically
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { navLinks } from "@/lib/constants";
import { usePathname } from "next/navigation";

// ✅ Dynamically Import `UserButton` (Fixes the Server Component Issue)
const UserButton = dynamic(() => import("@clerk/nextjs").then((mod) => mod.UserButton), {
  ssr: false, // ✅ Prevents running on the server
});

export function LeftSideBar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="mt-3 ms-5">
        <Image src="/logo.png" alt="logo" width={150} height={100} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((item, index) => (
                <SidebarMenuItem key={index} className="my-2 ms-5">
                  <SidebarMenuButton
                    asChild
                    className={`${pathname === item.url
                        ? "text-blue-500 border-e-3 rounded-e-none border-gray-400"
                        : ""
                      }`}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <div className="flex items-center gap-3 my-2 ms-5">
                <div className="border rounded-[100%] p-1 border-gray-400 flex justify-center items-center">
                  <UserButton /> {/* ✅ Now safely imported */}
                </div>
                <p>Edit Profile</p>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
