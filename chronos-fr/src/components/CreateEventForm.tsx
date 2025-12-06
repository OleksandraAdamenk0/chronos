import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {DataTimeInput} from "@/components/dataTimeInput.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {toast} from "sonner";
import {type Ref, useEffect, useState} from "react";
import type {CategoryType, EventCreateType, RepeatType} from "@/types";
import {useCalendar} from "@/hooks/useCalendar.ts";
import MiniMapPicker from "@/components/MiniMapPicker.tsx";
import {POST} from "@/utils/api.ts";
import {useEvent} from "@/hooks/useEvent.ts";

interface CreateEventFormProps {
  ref: Ref<HTMLFormElement>;
  date?: Date;
  onExit?: () => void;
}

export const CreateEventForm = ({ref, date, onExit}: CreateEventFormProps) => {
  const [isRepeat, setIsRepeat] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const {getCategories, getCalendarId, loading, getPermissions} = useCalendar();
  const {addEvents} = useEvent();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (!date) return;
    setStartDate(date);
    const end = new Date(date);
    end.setHours(end.getHours() + 1);
    setEndDate(end);
  }, [date]);

  useEffect(() => {
    if (!loading) setCategories(getCategories());
  }, [loading]);

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!getPermissions().manageEvents) {
      toast.warning("You do not have permissions to create events");
      if (onExit) onExit();
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
      const result = await POST(`calendar/${getCalendarId()}/events/`, data);
      if (!result.success) return toast.error("Something went wrong");
      addEvents([{
        id: result.data.id,
        calendarId: getCalendarId(),
        title: data.title,
        startDate: startDate,
        endDate: endDate,
        color: result.data.color,
      }])
      if (onExit) onExit();
      toast.success("Event created");
    } catch (error) {
      console.log(error);
      toast.error("Ups. Something went wrong, please try again later");
    }
  }

  console.log("categories: ", categories)

  return (
    <form ref={ref} onSubmit={handleCreateEvent} className="w-full">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <DataTimeInput date={startDate} setDate={setStartDate}></DataTimeInput>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="endDate">End Date</Label>
          <DataTimeInput date={endDate} setDate={setEndDate}></DataTimeInput>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="isRepeat">Repeat</Label>
          <Checkbox
            id="isRepeat"
            name="isRepeat"
            checked={isRepeat}
            onCheckedChange={(val: boolean) => setIsRepeat(val)}
          />
        </div>

        {isRepeat && (
          <div className="grid gap-2">
            <Label htmlFor="startRepeatDate">Repeat Start</Label>
            <Input id="startRepeatDate" name="startRepeatDate" type="date" />
            <Label htmlFor="endRepeatDate">Repeat End</Label>
            <Input id="endRepeatDate" name="endRepeatDate" type="date" />
            <Label htmlFor="period">Period</Label>
            <Select name="period">
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

        <div className="grid gap-2">
          <Label htmlFor="reminderTime">Reminder Time</Label>
          <DataTimeInput date={reminderDate} setDate={setReminderDate}></DataTimeInput>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories && categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>

          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Location (optional)</Label>
          <MiniMapPicker value={address} onChange={setAddress} />
        </div>

      </div>
    </form>

  )
}