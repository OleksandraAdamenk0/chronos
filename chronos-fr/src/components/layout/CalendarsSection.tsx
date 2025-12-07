import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu.tsx";
import {FaCaretLeft} from "react-icons/fa6";
import {ImageDown, Share2, Trash2} from "lucide-react";
import {CreateCalendar} from "@/components/dialogs/CreateCalendar.tsx";
import {useState} from "react";
import {useCalendar} from "@/hooks/useCalendar.ts";
import type {CalendarPreviewType} from "@/types";
import {toast} from "sonner";
import {DELETE} from "@/utils/api.ts";
import {ChangeCalendar} from "@/components/dialogs/ChangeCalendar.tsx";
import {ShareCalendar} from "@/components/dialogs/ShareCalendar.tsx";


export const CalendarsSection = () => {
  const {getCalendars, getCalendarId, setCalendarId, deleteCalendar, getPermissions} = useCalendar();
  const [open, setOpen] = useState<boolean>(false);  // section
  const [changeOpen, setChangeOpen] = useState<boolean>(false);
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarPreviewType | null>(null);

  const handleDeleteCalendar = async (calendar: CalendarPreviewType) => {
    if (calendar.id === "0") return toast.warning("You can not delete the holidays calendar");
    try {
      const result = await DELETE(`calendar/${calendar.id}`);
      if (!result.success) return toast.error(result.error);
      else toast.success("Calendar deleted successfully.");
      deleteCalendar(calendar.id);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  const openChangeDialog = (calendar: CalendarPreviewType) => {
    setChangeOpen(true);
    setSelectedCalendar(calendar);
  }

  const openShareDialog = (calendar: CalendarPreviewType) => {
    setShareOpen(true);
    setSelectedCalendar(calendar);
  }

  console.log(getPermissions())

  return (
    <div>
      <Button variant="outline" className="w-full mb-2" onClick={() => setOpen(!open)}>
        My Calendars
      </Button>
      {open && (
        <div className="w-full bg-accent rounded-md">

          <CreateCalendar/>

          <div className="flex flex-col">
            {getCalendars().map((calendar, index) => {
              return (
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div
                      key={calendar.id}
                      className={`font-bold py-2 px-6 flex cursor-pointer items-center rounded-md 
                          ${getCalendarId() === calendar.id ? "justify-between" : "justify-start"}`}
                      style={{
                        transition: "background 0.5s"
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = calendar.color)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      onClick={() => setCalendarId(calendar.id)}
                    >
                      <span className="text-primary">{calendar.name}</span>
                      {getCalendarId() === calendar.id && <FaCaretLeft className="text-primary" />}
                    </div>
                    {index < getCalendars().length - 1 && (<Separator/>)}
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    {getPermissions().manageParticipants && (
                      <ContextMenuItem onClick={() => openShareDialog(calendar)}><Share2 className="mr-2 h-4 w-4" />Share</ContextMenuItem>
                    )}
                    <ContextMenuItem onClick={() => openChangeDialog(calendar)}><ImageDown className="mr-2 h-4 w-4" />Change</ContextMenuItem>
                    <ContextMenuItem onClick={() => handleDeleteCalendar(calendar)}><Trash2 className="mr-2 h-4 w-4" />Delete</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              )})}

          </div>

          {selectedCalendar && (
            <div>
              <ChangeCalendar calendar={selectedCalendar} open={changeOpen} setOpen={setChangeOpen} />
              <ShareCalendar calendar={selectedCalendar} open={shareOpen} setOpen={setShareOpen} />
            </div>
          )}
        </div>
      )}
    </div>

  )
}