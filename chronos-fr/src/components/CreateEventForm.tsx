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

interface CreateEventFormProps {
  ref: Ref<HTMLFormElement>;
  date?: Date;
}

export const CreateEventForm = ({ref, date}: CreateEventFormProps) => {
  const [isRepeat, setIsRepeat] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const {getCategories, getCalendarId, loading} = useCalendar();

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

    // check dates input
    if (!startDate || !endDate) {
      toast.error("Please enter a valid start and end dates");
      return;
    }

    const form = new FormData(e.currentTarget);

    // check inputs
    const title = form.get("title");
    const description = form.get("description");

    if (!title || !description) {
      toast.error("Please enter a valid title and description");
      return;
    }

    const data: EventCreateType = {
      title: title as string,
      description:description as string,
      isRepeat: form.get("isRepeat") === "on",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      address: address
    }

    if (isRepeat) {
      // check values
      const period = form.get("period");
      const startRepeatDate = form.get("startRepeatDate");
      const endRepeatDate = form.get("endRepeatDate");

      if (!period || !startRepeatDate || !endRepeatDate) {
        toast.error("Please enter a valid repeat data");
        return;
      }

      data.period = period as string as RepeatType;
      data.startRepeatDate = (startRepeatDate as unknown as Date).toISOString();
      data.endRepeatDate = (endRepeatDate as unknown as Date).toISOString();
    }

    try {
      await POST(`calendar/${getCalendarId()}/event`, data);
    } catch (error) {
      console.log(error);
      toast.error("Ups. Something went wrong, please try again later");
    }
  }


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
              {categories.map(c => (
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