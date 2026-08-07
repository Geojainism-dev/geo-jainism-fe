import { format, isToday } from "date-fns";
import { Clock, MapPin, Plus, Sparkles, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dayKey, getEventColor, getEventHour, HOURS } from "./calendarUtils";

export default function DayView({
  currentDate,
  eventsByDay,
  onSelectEvent,
  onPrevDay,
  onNextDay,
}) {
  const key = dayKey(currentDate);
  const dayEvents = eventsByDay.get(key) ?? [];
  const today = isToday(currentDate);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      {/* Day Overview Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevDay}
            className="h-8 w-8 rounded-full border-border/80"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {format(currentDate, "EEEE, MMMM d, yyyy")}
              </h2>
              {today && (
                <span className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                  Today
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {dayEvents.length === 0
                ? "No events scheduled for this day."
                : `${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""} scheduled.`}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onNextDay}
            className="h-8 w-8 rounded-full border-border/80"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button asChild size="sm" className="bg-primary text-primary-foreground">
          <Link to="/admin/events/new" className="gap-1.5 font-medium">
            <Plus className="h-4 w-4" /> Add Event for this Day
          </Link>
        </Button>
      </div>

      {/* Main Content Grid: Schedule + Side Summary */}
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-3">
        {/* Main Schedule Column (Hourly Timeline) */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm lg:col-span-2">
          <div className="border-b border-border/80 bg-muted/40 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Hourly Schedule</span>
            <span>7:00 AM - 10:00 PM</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {HOURS.map((hour) => {
              const matchingEvents = dayEvents.filter(
                (e) => getEventHour(e.localTime) === hour
              );

              const hourLabel =
                hour === 12
                  ? "12:00 PM"
                  : hour > 12
                  ? `${hour - 12}:00 PM`
                  : `${hour}:00 AM`;

              return (
                <div
                  key={hour}
                  className="flex gap-4 border-b border-border/40 pb-3 last:border-b-0"
                >
                  <div className="w-20 text-xs font-bold text-muted-foreground shrink-0 pt-1">
                    {hourLabel}
                  </div>

                  <div className="flex-1 space-y-2">
                    {matchingEvents.length === 0 ? (
                      <div className="h-8 rounded-md border border-dashed border-border/40 bg-muted/10" />
                    ) : (
                      matchingEvents.map((event) => {
                        const color = getEventColor(event);
                        return (
                          <div
                            key={event.id}
                            onClick={() => onSelectEvent(event)}
                            className={cn(
                              "group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer",
                              color.bg,
                              color.border,
                              color.text
                            )}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={cn("h-2.5 w-2.5 rounded-full", color.dot)} />
                                <h3 className="font-bold text-base leading-snug">
                                  {event.title}
                                </h3>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs font-medium opacity-90">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {event.localTime || "Time TBD"}
                                </span>
                                {event.venue && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {event.venue}
                                    {event.city ? `, ${event.city}` : ""}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-0.5 text-xs font-bold",
                                  event.isActive
                                    ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {event.isActive ? "Active" : "Draft"}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs font-semibold bg-background/80"
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Link to={`/admin/events/${event.id}/edit`}>Edit</Link>
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" /> Day Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Total Scheduled Events</span>
                <span className="font-bold text-foreground text-sm">{dayEvents.length}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Active Screenings</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {dayEvents.filter((e) => e.isActive).length}
                </span>
              </div>
            </div>

            {dayEvents.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-muted-foreground">Events Today:</h4>
                <div className="space-y-2">
                  {dayEvents.map((event) => {
                    const color = getEventColor(event);
                    return (
                      <div
                        key={event.id}
                        onClick={() => onSelectEvent(event)}
                        className={cn(
                          "rounded-lg border p-2.5 text-xs transition-all hover:scale-[1.01] cursor-pointer",
                          color.bg,
                          color.border,
                          color.text
                        )}
                      >
                        <p className="font-bold truncate">{event.title}</p>
                        <p className="mt-0.5 text-[11px] opacity-85">
                          {event.localTime} · {event.venue}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
