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
import React, {useState} from "react";
import {POST} from "@/utils/api.ts";
import {toast} from "sonner";
import {useCalendar} from "@/hooks/useCalendar.ts";

const CreateCategory = () => {
  const [color, setColor] = useState("#34258f");
  const {getCategories, addCategory, getCalendarId} = useCalendar();

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.name as unknown as HTMLInputElement).value;
    const description = (form.description as unknown as HTMLInputElement).value;
    try {
      const result = await POST(`calendar/${getCalendarId()}/categories/`, {name, description, color} );
      if (!result.success) {
        toast.error("Error creating category");
        return;
      }
      console.log("Successfully created", result);
      addCategory(result.data);
      setColor("#34258f");
      toast.success("Category created");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
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
  )
}

export default CreateCategory;