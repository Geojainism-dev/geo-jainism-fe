import { useMemo } from "react";
import {
  addMonths,
  subMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "./calendarData";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function MiniCalendar({
  selectedDate,
  onSelectDate,
  miniMonth,
  onChangeMiniMonth,
  events = [],
}) {
  const daysGrid = useMemo(() => {
    const start = startOfWeek(startOfMonth(miniMonth));
    const end = endOfWeek(endOfMonth(miniMonth));
    return eachDayOfInterval({ start, end });
  }, [miniMonth]);

  return (
    <div className="w-full space-y-3">
      {/* Month Title & Chevron Controls */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {format(miniMonth, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onChangeMiniMonth(subMonths(miniMonth, 1))}
            className="p-1 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Previous month"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChangeMiniMonth(addMonths(miniMonth, 1))}
            className="p-1 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Next month"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500">
        {WEEKDAYS.map((day, idx) => (
          <div key={idx} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 text-center text-xs gap-y-1">
        {daysGrid.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, miniMonth);
          const isDayToday = isToday(day);

          // Get events for this day
          const dayEvents = events.filter((e) => isSameDay(new Date(e.from), day));

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative h-7 w-7 mx-auto flex items-center justify-center rounded-full text-xs transition-all font-medium",
                isSelected
                  ? "bg-slate-900 text-white font-bold shadow-xs dark:bg-slate-100 dark:text-slate-900"
                  : isDayToday
                  ? "ring-1 ring-slate-900 text-slate-900 font-bold dark:ring-slate-100 dark:text-slate-100"
                  : isCurrentMonth
                  ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  : "text-slate-300 dark:text-slate-600 hover:bg-slate-50"
              )}
            >
              <span>{format(day, "d")}</span>

              {/* Event Dot Indicator */}
              {dayEvents.length > 0 && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                  {dayEvents.slice(0, 2).map((evt) => {
                    const cat = CATEGORIES.find((c) => c.id === evt.category) || CATEGORIES[0];
                    return (
                      <span
                        key={evt.id}
                        className={cn(
                          "h-1 w-1 rounded-full",
                          isSelected
                            ? "bg-white dark:bg-slate-900"
                            : cat.id === "active"
                            ? "bg-blue-600"
                            : "bg-amber-500"
                        )}
                      />
                    );
                  })}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
