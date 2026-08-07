import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfWeek,
  endOfMonth,
  startOfMonth,
  startOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "./calendarData";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 06:00 to 20:00
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function ScheduleGrid({
  selectedDate,
  onSelectDate,
  viewMode,
  onChangeViewMode,
  onPrev,
  onNext,
  onToday,
  events,
  onSelectEvent,
  isFullscreen,
  onToggleFullscreen,
}) {
  // Days for Week View
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  // Days for Month View
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(selectedDate));
    const end = endOfWeek(endOfMonth(selectedDate));
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  // Current time position (for green time line in Day/Week views)
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const showCurrentTimeLine = currentHour >= 6 && currentHour <= 20;
  const timeLineTopPercent = ((currentHour - 6 + currentMinute / 60) / 15) * 100;

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {viewMode === "month"
              ? format(selectedDate, "MMMM yyyy")
              : viewMode === "day"
              ? format(selectedDate, "EEEE, MMMM d, yyyy")
              : "My Schedule"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation < Today > */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 p-0.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={onPrev}
              className="px-2 py-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onToday}
              className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 border-x border-slate-200 dark:border-slate-700"
            >
              Today
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-2 py-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* View Switchers: Day | Week | Month */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 p-0.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => onChangeViewMode("day")}
              className={cn(
                "px-3 py-1 rounded-md transition-all",
                viewMode === "day"
                  ? "bg-blue-600 text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              )}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode("week")}
              className={cn(
                "px-3 py-1 rounded-md transition-all",
                viewMode === "week"
                  ? "bg-blue-600 text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              )}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode("month")}
              className={cn(
                "px-3 py-1 rounded-md transition-all",
                viewMode === "month"
                  ? "bg-blue-600 text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              )}
            >
              Month
            </button>
          </div>

          {/* Full Screen Toggle Button */}
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Full Screen Mode"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Exit</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5 text-purple-600" />
                  <span>Full Screen</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: MONTH VIEW */}
      {viewMode === "month" && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Month Weekdays Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 text-center dark:border-slate-800 dark:bg-slate-900/50">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                {day}
              </div>
            ))}
          </div>

          {/* Month Grid Cells */}
          <div className="grid flex-1 grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200/80 bg-slate-50/20 overflow-y-auto dark:divide-slate-800">
            {monthDays.map((day) => {
              const dayEvents = events.filter((e) => isSameDay(new Date(e.from), day));
              const inMonth = isSameMonth(day, selectedDate);
              const isDayToday = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => {
                    onSelectDate(day);
                    onChangeViewMode("day");
                  }}
                  className={cn(
                    "group flex min-h-[100px] flex-col p-2 transition-all hover:bg-slate-100/60 cursor-pointer dark:hover:bg-slate-800/40",
                    !inMonth && "bg-slate-50/50 opacity-40 dark:bg-slate-950/50",
                    isDayToday && "bg-blue-50/40 font-bold dark:bg-blue-950/20"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                          isDayToday
                            ? "bg-blue-600 text-white shadow-2xs"
                            : inMonth
                            ? "text-slate-800 dark:text-slate-200"
                            : "text-slate-400"
                        )}
                      >
                        {format(day, "d")}
                      </span>

                      {/* Event Dot Indicators */}
                      {dayEvents.length > 0 && (
                        <div className="flex items-center gap-1">
                          {dayEvents.slice(0, 3).map((evt) => {
                            const cat = CATEGORIES.find((c) => c.id === evt.category) || CATEGORIES[0];
                            return (
                              <span
                                key={evt.id}
                                className={cn("h-2 w-2 rounded-full shadow-2xs shrink-0", cat.bgClass)}
                                title={evt.title}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-1 flex-col gap-1 overflow-hidden">
                    {dayEvents.slice(0, 3).map((evt) => {
                      const cat = CATEGORIES.find((c) => c.id === evt.category) || CATEGORIES[0];
                      return (
                        <div
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEvent(evt);
                          }}
                          className={cn(
                            "truncate rounded-sm px-1.5 py-0.5 text-[11px] font-semibold text-white shadow-2xs transition-transform hover:scale-[1.02]",
                            cat.bgClass
                          )}
                        >
                          {evt.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        +{dayEvents.length - 3} more...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: DAY VIEW */}
      {viewMode === "day" && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/60 p-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </div>

          <div className="relative flex-1 overflow-y-auto">
            <div className="relative grid grid-cols-[80px_1fr] divide-x divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
              {/* Time Labels */}
              <div className="divide-y divide-slate-100 bg-slate-50/30 text-right pr-3 font-mono text-xs text-slate-400 dark:divide-slate-800 dark:bg-slate-950/30">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-20 pt-2">
                    {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                  </div>
                ))}
              </div>

              {/* Single Day Column */}
              <div className="relative divide-y divide-slate-100 dark:divide-slate-800/60">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-20 border-t border-slate-100 dark:border-slate-800/40" />
                ))}

                {/* Day Events */}
                {events
                  .filter((e) => isSameDay(new Date(e.from), selectedDate))
                  .map((evt) => {
                    const startDate = new Date(evt.from);
                    const endDate = new Date(evt.to);
                    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
                    const endHour = endDate.getHours() + endDate.getMinutes() / 60;

                    const topPx = (startHour - 6) * 80;
                    const durationHours = Math.max(0.5, endHour - startHour);
                    const heightPx = durationHours * 80;

                    const cat = CATEGORIES.find((c) => c.id === evt.category) || CATEGORIES[0];

                    return (
                      <div
                        key={evt.id}
                        onClick={() => onSelectEvent(evt)}
                        style={{
                          top: `${topPx}px`,
                          height: `${heightPx}px`,
                        }}
                        className={cn(
                          "absolute left-4 right-4 z-10 flex flex-col justify-between rounded-xl p-4 text-white shadow-md transition-all hover:scale-[1.01] hover:z-20 cursor-pointer overflow-hidden leading-tight",
                          cat.bgClass
                        )}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                              {cat.name}
                            </span>
                          </div>
                          <h3 className="mt-1 font-bold text-base">{evt.title}</h3>
                        </div>

                        <div className="flex items-center gap-4 text-xs opacity-90">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5" />
                            {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                          </span>
                          {evt.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {evt.venue}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: WEEK VIEW (Matching Screenshot) */}
      {viewMode === "week" && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Column Headers: SUN 02, MON 03, WED 05 (active shaded column) */}
          <div className="grid grid-cols-[70px_repeat(7,1fr)] border-b border-slate-200 bg-slate-50/50 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <div className="p-3 text-xs font-semibold text-slate-400 border-r border-slate-200 dark:border-slate-800" />
            {weekDays.map((day) => {
              const isSelectedDay = isSameDay(day, selectedDate);
              const isDayToday = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => onSelectDate(day)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 border-r border-slate-200 last:border-r-0 transition-colors dark:border-slate-800",
                    isSelectedDay || isDayToday
                      ? "bg-slate-200/70 dark:bg-slate-800 font-bold"
                      : "hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                  )}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {format(day, "EEE")}
                  </span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {format(day, "dd")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hourly Grid with Events */}
          <div className="relative flex-1 overflow-y-auto">
            <div className="relative grid grid-cols-[70px_repeat(7,1fr)] divide-x divide-slate-200 border-b border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
              {/* Time Labels */}
              <div className="divide-y divide-slate-100 bg-slate-50/30 text-right pr-3 font-mono text-xs text-slate-400 dark:divide-slate-800 dark:bg-slate-950/30">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-16 pt-1">
                    {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                  </div>
                ))}
              </div>

              {/* 7 Day Columns */}
              {weekDays.map((day) => {
                const dayEvents = events.filter((e) =>
                  isSameDay(new Date(e.from), day)
                );

                return (
                  <div key={day.toISOString()} className="relative divide-y divide-slate-100 dark:divide-slate-800/60">
                    {HOURS.map((hour) => (
                      <div key={hour} className="h-16 border-t border-slate-100 dark:border-slate-800/40" />
                    ))}

                    {/* Render Event Blocks */}
                    {dayEvents.map((evt) => {
                      const startDate = new Date(evt.from);
                      const endDate = new Date(evt.to);
                      const startHour = startDate.getHours() + startDate.getMinutes() / 60;
                      const endHour = endDate.getHours() + endDate.getMinutes() / 60;

                      const topPx = (startHour - 6) * 64;
                      const durationHours = Math.max(0.5, endHour - startHour);
                      const heightPx = durationHours * 64;

                      const cat = CATEGORIES.find((c) => c.id === evt.category) || CATEGORIES[0];

                      return (
                        <div
                          key={evt.id}
                          onClick={() => onSelectEvent(evt)}
                          style={{
                            top: `${topPx}px`,
                            height: `${heightPx}px`,
                          }}
                          className={cn(
                            "absolute left-1 right-1 z-10 flex flex-col justify-start rounded-md p-2 text-white shadow-sm transition-all hover:scale-[1.02] hover:z-20 cursor-pointer overflow-hidden leading-tight",
                            cat.bgClass
                          )}
                        >
                          <h4 className="font-semibold text-xs truncate">
                            {evt.title}
                          </h4>
                          <p className="mt-0.5 text-[10px] opacity-90 font-mono">
                            {format(startDate, "H:mm")} - {format(endDate, "H:mm")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Current Time Green Line Indicator */}
            {showCurrentTimeLine && (
              <div
                style={{ top: `${(timeLineTopPercent / 100) * (HOURS.length * 64)}px` }}
                className="pointer-events-none absolute left-0 right-0 z-30 flex items-center"
              >
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm ml-[65px]" />
                <div className="h-[2px] flex-1 bg-emerald-500" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
