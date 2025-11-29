import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {ModeToggle} from "@/components/mode-toggle.tsx";
import {Button} from "@/components/ui/button.tsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {useCalendar} from "@/hooks/useCalendar.ts";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {getView, setView} = useCalendar();

  const changeView = (direction: "left" | "right") => {
    switch (getView()) {
      case "day":
        if (direction === "right") setView("week");
        else setView("events");
        break;
      case "week":
        if (direction === "right") setView("month");
        else setView("day");
        break;
      case "month":
        if (direction === "right") setView("year");
        else setView("week");
        break;
      case "year":
        if (direction === "right") setView("events");
        else setView("month");
        break;
      case "events":
        if (direction === "right") setView("day");
        else setView("year");
        break;
    }
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col-reverse md:flex-col min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 bg-muted border-b border-border">
          <SidebarTrigger />

          <div className="flex items-center gap-4">
            <Button className="bg-button border-button" onClick={() => changeView("left")}><FaChevronLeft /></Button>
            <span>{getView()}</span>
            <Button className="bg-button border-button" onClick={() => changeView("right")}><FaChevronRight /></Button>
          </div>
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8 logo" />
            <span className="font-bold text-lg">Chronos</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}