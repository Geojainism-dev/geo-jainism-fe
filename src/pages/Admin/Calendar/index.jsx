import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  addMonths,
  subMonths,
} from "date-fns";
import { Plus, Lightbulb, RefreshCw, Calendar as CalendarIcon, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScreenings } from "@/features/screenings/hooks";
import { cn } from "@/lib/utils";
import MiniCalendar from "./MiniCalendar";
import CategoryFilter from "./CategoryFilter";
import ScheduleGrid from "./ScheduleGrid";
import EventModal from "./EventModal";
import { getScreeningCategory } from "./calendarData";

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [miniMonth, setMiniMonth] = useState(() => new Date());
  const [viewMode, setViewMode] = useState("week"); // 'day' | 'week' | 'month'
  const [selectedCategories, setSelectedCategories] = useState([
    "active",
    "inactive",
  ]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch live events from backend
  const { data, isLoading, isError, refetch } = useScreenings({ page: 1, limit: 100 });

  // Map backend screening objects directly into calendar event objects
  const backendEvents = useMemo(() => {
    const screenings = data?.screenings ?? [];

    return screenings.map((s, idx) => {
      // Parse start & end dates from backend screening date/localTime
      let start = s.date ? new Date(s.date) : s.localDate ? new Date(s.localDate) : new Date();
      if (isNaN(start.getTime())) start = new Date();

      if (s.localTime) {
        const timeStr = String(s.localTime).trim().toLowerCase();
        const match24 = timeStr.match(/^(\d{1,2}):(\d{2})/);
        if (match24) {
          let hour = parseInt(match24[1], 10);
          const min = parseInt(match24[2], 10);
          if (timeStr.includes("pm") && hour < 12) hour += 12;
          if (timeStr.includes("am") && hour === 12) hour = 0;
          start.setHours(hour, min, 0, 0);
        } else {
          const match12 = timeStr.match(/^(\d{1,2})\s*(am|pm)/i);
          if (match12) {
            let hour = parseInt(match12[1], 10);
            if (match12[2].toLowerCase() === "pm" && hour < 12) hour += 12;
            if (match12[2].toLowerCase() === "am" && hour === 12) hour = 0;
            start.setHours(hour, 0, 0, 0);
          }
        }
      }

      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hr duration
      const cat = getScreeningCategory(s, idx);

      return {
        id: String(s.id),
        title: s.title || "Untitled Event",
        description: s.description,
        from: start,
        to: end,
        localTime: s.localTime,
        localDate: s.localDate,
        timezone: s.timezone,
        venue: s.venue,
        venueAddress: s.venueAddress,
        city: s.city,
        country: s.country,
        capacity: s.capacity,
        isActive: s.isActive,
        category: cat.id,
        bgClass: cat.bgClass,
      };
    });
  }, [data]);

  // Available filter categories derived from backend events
  const dynamicCategories = useMemo(() => {
    return [
      { id: "active", name: "Active Events", bgClass: "bg-blue-600", textClass: "text-blue-600" },
      { id: "inactive", name: "Draft / Inactive", bgClass: "bg-amber-500", textClass: "text-amber-600" },
    ];
  }, []);

  // Filter events by selected categories
  const filteredEvents = useMemo(() => {
    return backendEvents.filter((e) => selectedCategories.includes(e.category));
  }, [backendEvents, selectedCategories]);

  // Compute live event counts per category
  const eventCounts = useMemo(() => {
    const counts = { active: 0, inactive: 0 };
    for (const e of backendEvents) {
      if (counts[e.category] !== undefined) {
        counts[e.category]++;
      }
    }
    return counts;
  }, [backendEvents]);

  // Category toggle handler
  const handleToggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // Date Navigation
  const handlePrev = () => {
    if (viewMode === "week") {
      setSelectedDate((d) => subWeeks(d, 1));
      setMiniMonth((m) => subWeeks(m, 1));
    } else if (viewMode === "day") {
      setSelectedDate((d) => subDays(d, 1));
    } else if (viewMode === "month") {
      setSelectedDate((d) => subMonths(d, 1));
      setMiniMonth((m) => subMonths(m, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "week") {
      setSelectedDate((d) => addWeeks(d, 1));
      setMiniMonth((m) => addWeeks(m, 1));
    } else if (viewMode === "day") {
      setSelectedDate((d) => addDays(d, 1));
    } else if (viewMode === "month") {
      setSelectedDate((d) => addMonths(d, 1));
      setMiniMonth((m) => addMonths(m, 1));
    }
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setMiniMonth(today);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setMiniMonth(date);
  };

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full bg-transparent text-slate-900 dark:text-slate-100 transition-all",
        isFullscreen && "fixed inset-0 z-50 bg-slate-50 p-4 overflow-auto dark:bg-slate-950"
      )}
    >
      {/* Top Banner with live Sync Status */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Events Calendar
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Live schedule synced directly with backend database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 text-slate-500", isLoading && "animate-spin text-blue-600")} />
            <span>{isLoading ? "Syncing..." : "Refresh"}</span>
          </Button>

          <Button
            asChild
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
          >
            <Link to="/admin/events/new" className="gap-1.5">
              <Plus className="h-4 w-4" /> New Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Layout (Left Sidebar + Right Schedule Grid) */}
      <div className="flex flex-col lg:flex-row w-full flex-1 gap-6 overflow-hidden min-h-[800px] h-[calc(100vh-160px)]">
        {/* Left Sidebar (280px) */}
        <aside className="flex w-full lg:w-72 flex-col gap-6 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          {/* Mini Calendar Date Picker */}
          <MiniCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            miniMonth={miniMonth}
            onChangeMiniMonth={setMiniMonth}
            events={filteredEvents}
          />

          {/* + Create Event Button */}
          <Button
            asChild
            size="lg"
            className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 py-6"
          >
            <Link to="/admin/events/new" className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5 stroke-[2.5]" />
              <span>Create Event</span>
            </Link>
          </Button>

          {/* Categories Filter List */}
          <CategoryFilter
            categories={dynamicCategories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            eventCounts={eventCounts}
          />

          {/* Tip Box */}
          <div className="mt-auto rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 fill-amber-500/20 mt-0.5" />
              <div>
                <span className="font-bold">Tip:</span> Filter live events by active status or click any event to view details.
              </div>
            </div>
          </div>
        </aside>

        {/* Right Schedule Grid Panel */}
        <section className="flex flex-1 flex-col overflow-hidden">
          {isError ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
              <p className="text-sm font-semibold">
                Failed to load screening events from backend. Please check backend API server connection.
              </p>
            </div>
          ) : (
            <ScheduleGrid
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              onPrev={handlePrev}
              onNext={handleNext}
              onToday={handleToday}
              events={filteredEvents}
              onSelectEvent={setSelectedEvent}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          )}
        </section>
      </div>

      {/* Event Details Dialog Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
