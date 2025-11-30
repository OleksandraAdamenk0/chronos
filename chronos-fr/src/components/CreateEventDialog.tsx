import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {CreateEventForm} from "@/components/CreateEventForm.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useRef} from "react";


interface CreateEventFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateEventDialog({open, setOpen}: CreateEventFormProps) {
  const formRef = useRef<HTMLFormElement>(null);


  return (
    <Dialog open={open}>
      <DialogContent className="overflow-y-auto max-h-[90svh]">
        <DialogHeader>
          <DialogTitle>Create new Event</DialogTitle>
        </DialogHeader>

        <CreateEventForm ref={formRef} onExit={() => setOpen(false)}/>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => formRef.current?.requestSubmit()}
            >
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}