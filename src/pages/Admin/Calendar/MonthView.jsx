import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils";
import { dayKey, getEventColor } from "./calendarUtils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthView({
  currentDate,
  eventsByDay,
  onSelectEvent,
  onSelectDay,
}) {
  const gridDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
      {/* Weekdays Header */}
      <div className="grid grid-cols-7 border-b border-border/80 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-center font-bold">
        {WEEKDAYS.map((day, idx) => (
          <div
            key={day}
            className={cn(
              "py-2.5 text-xs font-bold uppercase tracking-wider",
              idx === 0 || idx === 6 ? "text-pink-600 dark:text-pink-400" : "text-foreground/80"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid flex-1 grid-cols-7 auto-rows-fr divide-x divide-y divide-border/60 bg-muted/10 overflow-y-auto">
        {gridDays.map((day) => {
          const key = dayKey(day);
          const events = eventsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onSelectDay(day)}
              className={cn(
                "group relative flex min-h-[110px] flex-col p-1.5 transition-all hover:bg-accent/40 cursor-pointer",
                !inMonth && "bg-muted/30 opacity-60",
                today && "bg-gradient-to-b from-indigo-500/5 to-purple-500/10 font-semibold ring-1 ring-inset ring-indigo-500/40"
              )}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between px-1 py-0.5">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-transform group-hover:scale-110",
                    today
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/30"
                      : inMonth
                      ? "text-foreground"
                      : "text-muted-foreground/60"
                  )}
                >
                  {format(day, "d")}
                </span>
                {events.length > 0 && (
                  <span className="text-[10px] font-semibold text-muted-foreground/80">
                    {events.length} {events.length === 1 ? "event" : "events"}
                  </span>
                )}
              </div>

              {/* Event Chips List */}
              <div className="mt-1 flex flex-1 flex-col gap-1 overflow-hidden">
                {events.slice(0, 3).map((event) => {
                  const color = getEventColor(event);
                  return (
                    <button
                      type="button"
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(event);
                      }}
                      className={cn(
                        "group/chip flex items-center gap-1 rounded-md border px-2 py-1 text-left text-xs font-medium transition-all shadow-2xs hover:scale-[1.02] hover:shadow-xs",
                        color.bg,
                        color.border,
                        color.text
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", color.dot)} />
                      <span className="truncate font-semibold text-[11px] leading-tight">
                        {event.title}
                      </span>
                      {event.localTime && (
                        <span className="ml-auto shrink-0 text-[10px] opacity-75">
                          {event.localTime.split(" ")[0]}
                        </span>
                      )}
                    </button>
                  );
                })}

                {events.length > 3 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDay(day);
                    }}
                    className="mt-auto px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-left hover:underline"
                  >
                    + {events.length - 3} more...
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
