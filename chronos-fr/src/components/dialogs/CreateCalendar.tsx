import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import ColorPicker from "@/components/colorPicker.tsx";
import {Button} from "@/components/ui/button.tsx";
import {POST} from "@/utils/api.ts";
import {toast} from "sonner";
import {useState} from "react";
import {useCalendar} from "@/hooks/useCalendar.ts";


export const CreateCalendar = () => {
  const {addCalendars} = useCalendar();
  const [open, setOpen] = useState<boolean>(false);
  const [color, setColor] = useState("#9a7cc5");

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
      setOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <Dialog open={open}>
      <DialogTrigger onClick={() => setOpen(true)} className="w-full rounded-md mb-4 p-2 bg-primary text-sm font-semibold text-primary-foreground">
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
            <DialogClose asChild>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}