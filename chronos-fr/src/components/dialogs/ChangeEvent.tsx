import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle}
  from "@/components/ui/dialog.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";
import {useCalendar} from "@/hooks/useCalendar.ts";
import {useEffect, useState} from "react";
import {GET, PATCH} from "@/utils/api.ts";
import type {DetailedEventType, EventCreateType, RepeatType} from "@/types";
import {DataTimeInput} from "@/components/dataTimeInput.tsx";
import MiniMapPicker from "@/components/MiniMapPicker.tsx";
import {useEvent} from "@/hooks/useEvent.ts";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  eventId: string | null;
}

export const ChangeEvent = ({open, setOpen, eventId}: Props) => {
  const {getPermissions, getCalendarId, getCategories} = useCalendar();
  const {changeEvents} = useEvent();

  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState<DetailedEventType | null>(null);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [period, setPeriod] = useState<RepeatType | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const result = await GET(`calendar/${getCalendarId()}/events/${eventId}`);
        console.log(result);
        if (!result.success) {
          toast.error("Something went wrong");
          setOpen(false);
          return;
        }
        setEvent(result.data);
        setStartDate(new Date(result.data.startDate));
        setEndDate(new Date(result.data.endDate));
        setAddress(result.data.address);
        if (result.data.reminder) setReminderDate(new Date(result.data.reminder));
        if (result.data.period) {
          setPeriod(result.data.period);
          setIsRepeat(true);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Something went wrong");
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }
    if (getCalendarId() === "0" || !eventId) {
      setOpen(false);
      return;
    }
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!getPermissions().manageEvents) {
      toast.warning("You do not have permissions to create events");
      setOpen(false);
      return;
    }
    const form = new FormData(e.currentTarget);

    // check inputs
    const title = form.get("title");
    const description = form.get("description");

    if (!title?.toString().trim() || !description?.toString().trim())
      return toast.error("Please enter a valid title and description");

    if (!startDate || !endDate || startDate > endDate)
      return toast.error("Please enter a valid start and end dates");

    const data: EventCreateType = {
      title: title as string,
      description:description as string,
      isRepeat: form.get("isRepeat") === "on",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      address: address
    }

    const categoryId = form.get("category");
    if (categoryId) data.categoryId = categoryId as string;
    if (reminderDate) data.reminder = reminderDate.toISOString();

    if (isRepeat) {
      // check values
      const period = form.get("period");
      const startRepeatDateStr = form.get("startRepeatDate");
      const endRepeatDateStr = form.get("endRepeatDate");

      if (!period || !startRepeatDateStr || !endRepeatDateStr)
        return toast.error("Please enter a valid repeat data");

      const startRepeatDate = new Date(startRepeatDateStr as string)
      const endRepeatDate = new Date(endRepeatDateStr as string);

      if (startRepeatDate > endRepeatDate)
        return toast.error("Please enter a valid repeat data");

      data.period = period as string as RepeatType;
      data.startRepeatDate = startRepeatDate.toISOString();
      data.endRepeatDate = endRepeatDate.toISOString();
    }

    try {
      const result = await PATCH(`calendar/${getCalendarId()}/events/${eventId}`, data);
      if (!result.success) return toast.error("Something went wrong");
      changeEvents([{
        id: result.data.id,
        calendarId: getCalendarId(),
        title: data.title,
        startDate: startDate,
        endDate: endDate,
        color: result.data.color,
      }])
      setOpen(false);
      toast.success("Event changed");
    } catch (error) {
      console.log(error);
      toast.error("Ups. Something went wrong, please try again later");
    }
  }

  if (loading) return <></>;

  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New calendar</DialogTitle>
            <DialogDescription>
              Create a new calendar to keep your plans organized and always at hand.
            </DialogDescription>
          </DialogHeader>
          {event && (
            <div className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={event.title}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={event.description}
                />
              </div>

              <div className="grid gap-2">
                <Label>Start Date</Label>
                <DataTimeInput
                  date={startDate}
                  setDate={setStartDate}
                />
              </div>

              <div className="grid gap-2">
                <Label>End Date</Label>
                <DataTimeInput
                  date={endDate}
                  setDate={setEndDate}
                />
              </div>

              {/* Repeat checkbox */}
              <div className="flex items-center gap-2">
                <Label htmlFor="isRepeat">Repeat</Label>
                <Checkbox
                  id="isRepeat"
                  name="isRepeat"
                  checked={isRepeat}
                  onCheckedChange={(val: boolean) => setIsRepeat(val)}
                />
              </div>

              {/* Repeat block */}
              {isRepeat && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="startRepeatDate">Repeat Start</Label>
                  <Input id="startRepeatDate" name="startRepeatDate" type="date" />
                  <Label htmlFor="endRepeatDate">Repeat End</Label>
                  <Input id="endRepeatDate" name="endRepeatDate" type="date" />
                  <Label htmlFor="period">Period</Label>
                  <Select name="period" defaultValue={period || undefined}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyday">Every Day</SelectItem>
                      <SelectItem value="everyweek">Every Week</SelectItem>
                      <SelectItem value="everymonth">Every Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Reminder */}
              <div className="grid gap-2">
                <Label>Reminder</Label>
                <DataTimeInput
                  date={reminderDate}
                  setDate={setReminderDate}
                />
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={event.category?.id ?? undefined}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategories().map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Map */}
              <div className="grid gap-2">
                <Label>Location</Label>
                <MiniMapPicker
                  value={address}
                  onChange={setAddress}
                />
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-start mt-4">
            <DialogClose asChild>
              <Button type="submit" variant="secondary">Save</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}