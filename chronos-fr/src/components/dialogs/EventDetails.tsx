import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import type {DetailedEventType} from "@/types";
import {toast} from "sonner";
import {GET} from "@/utils/api.ts";
import {useCalendar} from "@/hooks/useCalendar.ts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  eventId: string;
}

export const EventDetails = ({open, setOpen, eventId}: Props) => {
  const {getCalendarId} = useCalendar();
  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState<DetailedEventType | null>(null);

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
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Something went wrong");
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }
    if (getCalendarId() === "0") {
      setOpen(false);
      return;
    }
    fetchEvent();
  }, [eventId]);

  if (loading || !event) return <></>;

  console.log(event)

  return (
    <Dialog open={open}>
      <DialogContent className="overflow-y-auto max-h-[90svh] space-y-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            {event.title}
          </DialogTitle>
          {event.description && (
            <DialogDescription>{event.description}</DialogDescription>
          )}
        </DialogHeader>

        {/* Автор */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Created by</h3>

          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
            <Avatar className="size-10">
              {event.author.avatar ? (
                <AvatarImage src={event.author.avatar} />
              ) : (
                <AvatarFallback>
                  {event.author.login.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col">
              <span className="font-medium">{event.author.login}</span>
              <span className="text-xs text-muted-foreground">
            {event.author.email}
          </span>
            </div>
          </div>
        </section>

        <Separator />

        {/* Даты */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Event time</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Start</p>
              <p className="font-medium">
                {new Date(event.startDate).toLocaleString()}
              </p>
            </div>

            <div className="p-3 border rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">End</p>
              <p className="font-medium">
                {new Date(event.endDate).toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* Address */}
        {event.address && (
          <>
            <Separator />

            <section className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>

              <div className="w-full h-64 rounded-lg overflow-hidden border">
                <MapContainer
                  center={[
                    Number(event.address.split(",")[0]),
                    Number(event.address.split(",")[1])
                  ]}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[
                      Number(event.address.split(",")[0]),
                      Number(event.address.split(",")[1])
                    ]}
                  >
                    <Popup>
                      <strong>{event.title}</strong> <br />
                      Event location
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </section>
          </>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}