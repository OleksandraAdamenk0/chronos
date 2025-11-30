import {useState} from "react";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, } from "@/components/ui/sidebar"
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {Separator} from "@/components/ui/separator.tsx";
import {Input} from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label";

import {useCalendar} from "@/hooks/useCalendar.ts";

import { FaCaretLeft } from "react-icons/fa6";
import ColorPicker from "@/components/colorPicker.tsx";
import {DELETE, POST} from "@/utils/api.ts";
import {toast} from "sonner";
import {CreateEventDialog} from "@/components/CreateEventDialog.tsx";
import type {CalendarPreviewType, CategoryType} from "@/types";

import { Share2, ImageDown, Trash2 } from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {useUser} from "@/hooks/useUser.ts";


// function getContrastColor(hexColor: string) {
//   const c = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor;
//
//   const r = parseInt(c.substring(0, 2), 16);
//   const g = parseInt(c.substring(2, 4), 16);
//   const b = parseInt(c.substring(4, 6), 16);
//
//   const yiq = (r*299 + g*587 + b*114) / 1000;
//   console.log(yiq >= 128 ? 'black' : 'white')
//   return yiq >= 128 ? 'black' : 'white';
// }

export function AppSidebar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarsOpen, setIsCalendarsOpen] = useState<boolean>(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
  const [isUsersOpen, setIsUsersOpen] = useState<boolean>(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState<boolean>(false);
  const [color, setColor] = useState("#aabbcc");
  const {getCalendars, setStartDay, addCalendars, deleteCalendar, getCalendarId, setCalendarId, getPermissions, getCategories} = useCalendar();
  const {logout} = useUser();


  const handleDateSelect = (date: Date | undefined) => {
    if (date === undefined) return;
    setStartDay(date);
    setSelectedDate(date);
  };

  const handleCreateCalendar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const name = (form.name as unknown as HTMLInputElement).value;
    try {
      const result = await POST("/calendar/", {name, color});
      if (!result.success) {
        toast.error(result.error || "Something went wrong");
        return;
      }

      addCalendars([{id: result.data.id, color: color, name: name, type: "shared"}])

    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
    console.log(form);
  }

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.name as unknown as HTMLInputElement).value;
    const description = (form.description as unknown as HTMLInputElement).value;
    console.log(name, description, color);
  }

  const handleDeleteCalendar = async (calendar: CalendarPreviewType) => {
    if (calendar.id === "0") return toast.warning("You can not delete the holidays calendar");
    try {
      const result = await DELETE(`calendar/${calendar.id}`);
      if (!result.success) return toast.error(result.error);
      else toast.success(result.data.message);
      deleteCalendar(calendar.id);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  const handleChangeCalendar = () => {
    toast.warning("This feature is in development. Try again later.");
  }

  const handleShareCalendar = () => {
    toast.warning("This feature is in development. Try again later.");
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8 logo" />
          <span className="font-bold text-lg">Chronos</span>
        </div>
        <Separator className="mt-4 mb-4"/>
      </SidebarHeader>

      <SidebarContent>
        {/*create event*/}
        <SidebarGroup>
          <CreateEventDialog open={isCreateEventOpen} setOpen={setIsCreateEventOpen}/>
          <Button
            className="w-full mb-4"
            onClick={() => setIsCreateEventOpen(true)}
            disabled={getCalendars().filter(c => c.id == getCalendarId())[0]?.type === "holiday"}
          >
            Create Event
          </Button>
        </SidebarGroup>

        {/*calendar component*/}
        <SidebarGroup>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="mb-4 w-full"
          />
        </SidebarGroup>

        {/*calendars*/}
        <SidebarGroup>
            <Button variant="outline" className="w-full mb-2" onClick={() => setIsCalendarsOpen(!isCalendarsOpen)}>
              My Calendars
            </Button>
            {isCalendarsOpen && (
              <div className="w-full bg-accent rounded-md">

                <Dialog>
                <DialogTrigger className="w-full rounded-md mb-4 p-2 bg-primary text-sm font-semibold text-primary-foreground">
                  Create calendar
                </DialogTrigger>
                  <Separator />
                <DialogContent>
                  <form onSubmit={handleCreateCalendar}>
                    <DialogHeader>
                      <DialogTitle>New calendar</DialogTitle>
                      <DialogDescription>
                        Create a new calendar to keep your plans organized and always at hand.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" defaultValue="New calendar" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="color">Color</Label>
                        <ColorPicker value={color} onChange={setColor} />
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="submit" variant="secondary">Create</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

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
                          <ContextMenuItem onClick={handleShareCalendar}><Share2 className="mr-2 h-4 w-4" />Share</ContextMenuItem>
                          <ContextMenuItem onClick={handleChangeCalendar}><ImageDown className="mr-2 h-4 w-4" />Change</ContextMenuItem>
                          <ContextMenuItem onClick={() => handleDeleteCalendar(calendar)}><Trash2 className="mr-2 h-4 w-4 text-red-500" />Delete</ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    )})}
                </div>

              </div>
            )}
        </SidebarGroup>

        {/*categories*/}
        { getPermissions().manageCategories && (
          <SidebarGroup className="items-start">
            <Button variant="outline" className="w-full mb-2" onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
              Categories
            </Button>
            {isCategoriesOpen && (
                <div className="w-full bg-accent rounded-md">

                  <Dialog>
                    <DialogTrigger className="w-full rounded-md mb-4 p-2 bg-primary text-sm font-semibold text-primary-foreground">
                      Create new category
                    </DialogTrigger>
                    {getCategories().length > 0 && (<Separator />)}
                    <DialogContent>
                      <form onSubmit={handleCreateCategory}>
                        <DialogHeader>
                          <DialogTitle>New category</DialogTitle>
                          <DialogDescription>
                            Create a new category to keep your plans organized and always at hand.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 m-2">
                          <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" defaultValue="New category" />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Input type="text" id="description" defaultValue="Category description"></Input>
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="color">Color</Label>
                            <ColorPicker value={color} onChange={setColor} />
                          </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button type="submit" variant="secondary">Create</Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <div className="flex flex-col gap-2 pb-2">
                    {getCategories().map((category: CategoryType, index) => {
                      return (
                        <div className="flex flex-col gap-2">
                          <div
                            key={category.id}
                            className={`font-bold py-2 px-6 flex cursor-pointer items-center rounded-md justify-start`}
                            style={{transition: "background 0.5s"}}
                          >
                            <span className="text-primary">{category.name}</span>
                          </div>
                          {index < getCalendars().length - 1 && (<Separator/>)}
                        </div>
                      )})}
                  </div>

                </div>
            )}
          </SidebarGroup>
        ) }

        {/*users*/}
        { getPermissions().manageParticipants && (
          <SidebarGroup>
            <Button variant="outline" className="w-full mb-2" onClick={() => setIsUsersOpen(!isUsersOpen)}>
              Users
            </Button>
          </SidebarGroup>
        )}

      </SidebarContent>
      <SidebarFooter>

        <SidebarGroup>
          <Button variant="outline" className="w-full mb-2" onClick={logout}>Logout</Button>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex flex-col items-start px-3 pb-4 text-xs text-muted-foreground opacity-80 group">

            <p className="font-medium tracking-wide" style={{textShadow: "0 0 3px #9b5cff, 0 0 12px #c1bbd1"}}>
              Made by Aleksa — 2025
            </p>

            <p className="text-start">
              as part of the KhPI Innovation Campus
            </p>

            <a
              href="https://github.com/OleksandraAdamenk0/chronos"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 underline hover:text-primary transition"
              style={{
                textShadow: "0 0 4px #8a44ff"
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="opacity-80 group-hover:opacity-100"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.43 7.86 10.96.58.1.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.75-1.57-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.19-3.12-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.19a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.5 3.17-1.19 3.17-1.19.63 1.57.23 2.73.11 3.02.74.82 1.19 1.86 1.19 3.12 0 4.44-2.69 5.41-5.25 5.69.42.36.8 1.09.8 2.2 0 1.59-.01 2.86-.01 3.25 0 .31.21.67.8.56A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"></path>
              </svg>
              GitHub
            </a>

          </div>
        </SidebarGroup>

      </SidebarFooter>
    </Sidebar>
  )
}