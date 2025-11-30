import React from "react";


// hooks
import {useCalendar} from "@/hooks/useCalendar.ts";

// components
import WeekView from "@/components/views/weekView.tsx";
import EventsView from "@/components/views/eventsView.tsx";
import WeekDay from "@/components/views/weekDay.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import type {EventPreview} from "@/types";
import MonthView from "@/components/views/monthView.tsx";
import YearView from "@/components/views/yearView.tsx";

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const {getView, setView, startDay, setStartDay, getCalendarId} = useCalendar();

  const changeDate = (direction: string): void => {
    const newDate = new Date(startDay);

    switch (getView()) {
      case "day":
        newDate.setDate(direction === "prev"? newDate.getDate() - 1: newDate.getDate() + 1);
        setStartDay(newDate);
        break;
      case "week":
        newDate.setDate(direction === "prev"? newDate.getDate() - 7: newDate.getDate() + 7);
        setStartDay(newDate);
        break;
      case "month":
        newDate.setMonth(direction === "prev"? newDate.getMonth() - 1: newDate.getMonth() + 1);
        setStartDay(newDate);
        break;
      case "year":
        newDate.setFullYear(direction === "prev"? newDate.getFullYear() - 1: newDate.getFullYear() + 1);
        setStartDay(newDate);
        break;
    }
  }

  const handleDayClick = (date: Date): void => {
    if (getCalendarId() === "0") return;
    console.log(date.toString());
    navigate("/create", {state: {date: date}});
  }

  const handleDaySelection = (date: Date): void => {
    setStartDay(date);
    setView("day");
  }

  const handleEventClick = (event: EventPreview): void => {
    if (getCalendarId() === "0") return;
    console.log("event clicked:", event);
  }

  return (
    <div className="flex flex-col h-full">
      {getView() !== "events" && (
        <div className="flex justify-between gap-4 p-2">
          <Button variant="outline" onClick={() => changeDate("prev")} ><FaChevronLeft /></Button>
          {startDay.toLocaleString('default', { month: 'long', year: 'numeric' })}
          <Button variant="outline" onClick={() => changeDate("next")} ><FaChevronRight /></Button>
        </div>
      )}

      <div className="p-2 flex flex-col flex-1">
        {getView() === "week" ? (
          <WeekView
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
            />
        ): getView() === "day" ? (
          <WeekDay onDayClick={handleDayClick} day={startDay}/>
        ): getView() === "events"? (
          <EventsView onEventClick={handleEventClick}></EventsView>
        ): getView() === "month" ? (
          <MonthView date={startDay} onDayClick={handleDaySelection} type="full"/>
        ): getView() === "year" ? (
          <YearView date={startDay} onDayClick={handleDaySelection} />
        ): (
          <>This view is in development. Try later</>
        )}
      </div>
    </div>

  )
}

export default MainPage