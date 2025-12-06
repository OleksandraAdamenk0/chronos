import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {POST} from "@/utils/api.ts";
import {toast} from "sonner";
import React, {useState} from "react";
import type {CalendarPreviewType} from "@/types";
import { Checkbox } from "@/components/ui/checkbox"
import {validateEmail} from "@/utils/validation.ts";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  calendar: CalendarPreviewType;
}

export const ShareCalendar = ({open, setOpen, calendar}: Props) => {
  const [link, setLink] = useState<string | null>(null)
  const [post, setPost] = useState<boolean>(false);   // send by post or generate link

  const closeDialog = () => {
    setOpen(false);
    setPost(false);
    setLink(null);
  }

  const readPermissions = (form: EventTarget & HTMLFormElement) => {
    return  {
      manageCalendar: Boolean(form.calendar[0].ariaChecked),
      manageCategories: Boolean(form.categories[0].ariaChecked),
      manageParticipants: Boolean(form.participants[0].ariaChecked),
      manageEvents: Boolean(form.events[0].ariaChecked)
    }
  }

  const handleLinkSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const permissions = readPermissions(form);

    try {
      const result = await POST(`invite/${calendar.id}/link`, {permissions});
      if (!result.success) {
        toast.error(result.error || "Something went wrong");
        return;
      }
      setLink(result.data.link);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  }

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const permissions = readPermissions(form);

    const email = (form.email as unknown as HTMLInputElement).value;

    console.log(permissions, email);
    try {
      validateEmail(email);
      const result = await POST(`invite/${calendar.id}/mail`, {email, permissions});
      if (!result.success) {
        toast.error(result.error || "Something went wrong");
        return;
      }
      closeDialog();
      toast.success("Invitation successfully sent!");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <form onSubmit={post ? handlePostSubmit: handleLinkSubmit }>
          <DialogHeader>
            <DialogTitle>Share calendar</DialogTitle>
            <DialogDescription>
              Generate a shareable link to let others view or collaborate on your calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="my-6">
            {link ? (
              <div className="flex flex-col gap-3">
                <div>Your link:</div>
                <div className="p-2 bg-zinc-900 rounded text-sm overflow-y-auto h-16 break-all">{link}</div>
              </div>
            ) : (
              <div className="grid gap-6">
                <div className="flex gap-3">
                  <Checkbox id="calendar" name="calendar" />
                  <Label htmlFor="calendar">Permission to manage calendar</Label>
                </div>

                <div className="flex gap-3">
                  <Checkbox id="categories" name="categories" />
                  <Label htmlFor="categories">Permission to manage categories</Label>
                </div>

                <div className="flex gap-3">
                  <Checkbox id="participants" name="participants" />
                  <Label htmlFor="participants">Permission to manage participants</Label>
                </div>

                <div className="flex gap-3">
                  <Checkbox id="events" name="events" />
                  <Label htmlFor="events">Permission to manage events</Label>
                </div>
                {post && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email">Receiver email: </label>
                    <Input id="email" name="email"/>
                  </div>
                )}
              </div>
            )}
          </div>
            <DialogFooter className="sm:justify-start">
              {!link && (
                <div className="flex gap-2">
                  {!post && (
                    <DialogClose asChild>
                      <Button type="submit">Generate link</Button>
                    </DialogClose>)}
                  <DialogClose asChild>
                    {post &&
                      (<Button type="submit">Send</Button>)
                    }
                  </DialogClose>
                  <DialogClose asChild>
                    {!post && (
                      <Button type="button" onClick={(e) => {
                        e.stopPropagation();
                        setPost(true)
                      }}>Send by post</Button>)
                    }
                  </DialogClose>
                </div>
              )}
              <DialogClose asChild>
                <Button onClick={closeDialog} variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}