import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import ColorPicker from "@/components/colorPicker.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PATCH} from "@/utils/api.ts";
import {toast} from "sonner";
import {useEffect, useState} from "react";
import {useCalendar} from "@/hooks/useCalendar.ts";
import type {CalendarPreviewType} from "@/types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  calendar: CalendarPreviewType;
}

export const ChangeCalendar = ({open, setOpen, calendar}: Props) => {
  const {changeCalendar, getPermissions} = useCalendar();
  const [color, setColor] = useState(calendar.color);

  useEffect(() => {
    console.log(getPermissions());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (calendar.id === "0") {
      toast.warning("You can not edit this calendar");
      setOpen(false);
      return;
    }

    const form = e.currentTarget
    const name = (form.name as unknown as HTMLInputElement).value;
    try {
      const result = await PATCH(`calendar/${calendar.id}`, {name, color});
      if (!result.success) {
        toast.error(result.error || "Something went wrong");
        return;
      }
      changeCalendar(result.data.id, {color: color, name: name ?? calendar.name, type: "shared"})
      setOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New calendar</DialogTitle>
            <DialogDescription>
              Create a new calendar to keep your plans organized and always at hand.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {getPermissions().manageCalendar && (
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={calendar.name} />
              </div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="color">Color</Label>
              <ColorPicker value={color} onChange={setColor} />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
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