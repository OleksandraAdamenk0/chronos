// AppHeader.tsx
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCalendar } from "@/hooks/useCalendar.ts";
import {useUser} from "@/hooks/useUser.ts";
import {UserInfo} from "@/components/UserInfo.tsx";

export const AppHeader: React.FC = () => {
  const { getView, setView } = useCalendar();
  const {user} = useUser();
  console.log("user: ", user);

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
    <header className="flex items-center justify-between px-6 py-4 bg-muted border-b border-border">
      <SidebarTrigger />

      <div className="flex items-center gap-4">
        <Button className="bg-button border-button" onClick={() => changeView("left")}><FaChevronLeft /></Button>
        <span>{getView()}</span>
        <Button className="bg-button border-button" onClick={() => changeView("right")}><FaChevronRight /></Button>
      </div>

      {user && (<UserInfo />)}

      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </header>
  );
};
