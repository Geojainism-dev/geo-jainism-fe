import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns";
import { Clock, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { dayKey, getEventColor, getEventHour, HOURS } from "./calendarUtils";

export default function WeekView({
  currentDate,
  eventsByDay,
  onSelectEvent,
  onSelectDay,
}) {
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
      {/* Week Column Headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/80 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="flex items-center justify-center border-r border-border/60 p-2 text-xs font-bold text-muted-foreground">
          Time
        </div>
        {weekDays.map((day) => {
          const today = isToday(day);
          const activeDay = isSameDay(day, currentDate);
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex flex-col items-center justify-center p-2 transition-colors border-r border-border/60 last:border-r-0",
                today
                  ? "bg-indigo-500/15 dark:bg-indigo-500/25"
                  : activeDay
                  ? "bg-accent/60"
                  : "hover:bg-accent/40"
              )}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold",
                  today
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/30"
                    : "text-foreground"
                )}
              >
                {format(day, "d")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hourly Schedule Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] divide-x divide-border/60 bg-background">
          {/* Left Time Column */}
          <div className="divide-y divide-border/40 bg-muted/20">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex h-20 items-start justify-center pr-1 pt-1.5 text-[11px] font-semibold text-muted-foreground"
              >
                {hour === 12
                  ? "12 PM"
                  : hour > 12
                  ? `${hour - 12} PM`
                  : `${hour} AM`}
              </div>
            ))}
          </div>

          {/* 7 Day Schedule Columns */}
          {weekDays.map((day) => {
            const key = dayKey(day);
            const events = eventsByDay.get(key) ?? [];

            return (
              <div
                key={day.toISOString()}
                className="relative divide-y divide-border/40 bg-card/40"
              >
                {HOURS.map((hour) => {
                  const matchingEvents = events.filter(
                    (e) => getEventHour(e.localTime) === hour
                  );

                  return (
                    <div
                      key={hour}
                      className="group relative flex h-20 flex-col gap-1 p-1 transition-colors hover:bg-accent/30"
                    >
                      {matchingEvents.map((event) => {
                        const color = getEventColor(event);
                        return (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEvent(event);
                            }}
                            className={cn(
                              "group/card flex flex-col justify-between rounded-lg border p-1.5 text-xs shadow-xs transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer",
                              color.bg,
                              color.border,
                              color.text
                            )}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold truncate text-[11px] leading-tight">
                                {event.title}
                              </span>
                              <span
                                className={cn(
                                  "h-2 w-2 shrink-0 rounded-full",
                                  color.dot
                                )}
                              />
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[10px] opacity-90">
                              <span className="flex items-center gap-0.5 truncate">
                                <Clock className="h-3 w-3 shrink-0" />
                                {event.localTime}
                              </span>
                              {event.venue && (
                                <span className="flex items-center gap-0.5 truncate ml-1">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  {event.venue}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Hover action to add new event */}
                      {matchingEvents.length === 0 && (
                        <Link
                          to={`/admin/events/new`}
                          className="opacity-0 group-hover:opacity-100 absolute inset-1 flex items-center justify-center rounded-md border border-dashed border-primary/40 bg-primary/5 text-primary text-[11px] font-medium transition-all"
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add Event
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
