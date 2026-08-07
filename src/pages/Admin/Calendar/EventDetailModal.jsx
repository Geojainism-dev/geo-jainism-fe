import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ExternalLink, Edit, CheckCircle2, XCircle } from "lucide-react";
import { getEventColor } from "./calendarUtils";
import { cn } from "@/lib/utils";

export default function EventDetailModal({ event, onClose }) {
  if (!event) return null;
  const color = getEventColor(event);

  return (
    <Dialog open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md overflow-hidden p-0 rounded-2xl border-border/80 shadow-2xl">
        {/* Colorful Banner Header */}
        <div className={cn("p-6 text-foreground relative border-b", color.bg, color.border)}>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs", color.badge)}>
              Screening Event
            </span>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                event.isActive
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                  : "bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-300"
              )}
            >
              {event.isActive ? "Active Event" : "Draft Event"}
            </span>
          </div>

          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground leading-snug">
              {event.title}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-sm bg-card">
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-foreground">
              <Calendar className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Date
                </p>
                <p className="font-bold text-foreground">{event.localDate || "Date TBD"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-foreground">
              <Clock className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Time
                </p>
                <p className="font-bold text-foreground">{event.localTime || "Time TBD"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-foreground">
              <MapPin className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Venue & Location
                </p>
                <p className="font-bold text-foreground">
                  {event.venue || "Venue TBD"}
                  {event.city ? `, ${event.city}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/events/${event.id}`} target="_blank" className="gap-1.5">
                <ExternalLink className="h-4 w-4" /> View Public Page
              </Link>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white" asChild>
              <Link to={`/admin/events/${event.id}/edit`} className="gap-1.5 font-semibold">
                <Edit className="h-4 w-4" /> View / Edit Event
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
