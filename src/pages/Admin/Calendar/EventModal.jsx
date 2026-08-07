import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Edit, ExternalLink, Users, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  const startDate = new Date(event.from);
  const endDate = new Date(event.to);
  const bgClass = event.bgClass || (event.isActive ? "bg-blue-600" : "bg-amber-500");

  return (
    <Dialog open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md overflow-hidden p-0 rounded-2xl border-slate-200 shadow-2xl dark:border-slate-800">
        {/* Header */}
        <div className={cn("p-6 text-white relative", bgClass)}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
              {event.isActive ? "Active Event" : "Draft Event"}
            </span>
            {event.city && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/20 backdrop-blur-md text-white">
                {event.city}
              </span>
            )}
          </div>

          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-white leading-snug">
              {event.title}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4 text-sm bg-white dark:bg-slate-900">
          {event.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {event.description}
            </p>
          )}

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
                  Date
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {format(startDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
                  Time
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {event.localTime || `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`}
                  {event.timezone ? ` (${event.timezone})` : ""}
                </p>
              </div>
            </div>

            {(event.venue || event.venueAddress) && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
                    Location & Venue
                  </p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {event.venue || "Venue TBD"}
                  </p>
                  {event.venueAddress && (
                    <p className="text-xs text-slate-500">{event.venueAddress}</p>
                  )}
                  {event.city && (
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {event.city}{event.country ? `, ${event.country}` : ""}
                    </p>
                  )}
                </div>
              </div>
            )}

            {event.capacity && (
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
                    Capacity
                  </p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {event.capacity} seats
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {event.id && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/events/${event.id}`} target="_blank" className="gap-1">
                    <ExternalLink className="h-3.5 w-3.5" /> Public Page
                  </Link>
                </Button>
                <Button size="sm" className="bg-blue-600 text-white" asChild>
                  <Link to={`/admin/events/${event.id}/edit`}>
                    <Edit className="h-3.5 w-3.5 mr-1" /> View / Edit
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
