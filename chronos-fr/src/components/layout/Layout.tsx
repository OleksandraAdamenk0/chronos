import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col-reverse md:flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
