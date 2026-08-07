import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Maximize2,
  Minimize2,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { EVENT_COLORS } from "./calendarUtils";

export default function CalendarHeader({
  currentDate,
  viewMode,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  dateTitle,
  isFullscreen,
  onToggleFullscreen,
  searchQuery,
  onSearchChange,
  selectedColor,
  onSelectColor,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
      {/* Top bar: Title + Fullscreen + New event */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/20">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Calendar Schedule
              </h1>
              <span className="hidden rounded-full bg-gradient-to-r from-amber-500/10 to-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 sm:inline-flex border border-amber-500/20">
                <Sparkles className="mr-1 h-3 w-3" /> Live Agenda
              </span>
            </div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Manage all screenings & events in Month, Week & Day views
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            className={cn(
              "gap-1.5 font-medium transition-all",
              isFullscreen && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Full Screen Mode"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4 text-indigo-500" />
                <span className="hidden sm:inline">Full Screen</span>
              </>
            )}
          </Button>

          <Button asChild size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm">
            <Link to="/admin/events/new" className="gap-1.5 font-medium">
              <Plus className="h-4 w-4" />
              <span>New event</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Middle row: Navigation + Date Title + View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/80 bg-background/50 p-0.5 shadow-xs">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground hover:bg-accent"
              onClick={onPrev}
              aria-label="Previous interval"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground hover:bg-accent"
              onClick={onNext}
              aria-label="Next interval"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 font-semibold text-xs text-primary border-primary/30 hover:bg-primary/10"
            onClick={onToday}
          >
            Today
          </Button>

          <h2 className="ml-1 text-base font-bold tracking-tight text-foreground sm:text-lg">
            {dateTitle}
          </h2>
        </div>

        {/* Search & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative w-36 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 pl-8 text-xs bg-background/60"
            />
          </div>

          {/* View mode toggle tabs */}
          <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-1 shadow-xs">
            <button
              type="button"
              onClick={() => onViewChange("month")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-semibold transition-all",
                viewMode === "month"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => onViewChange("week")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-semibold transition-all",
                viewMode === "week"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => onViewChange("day")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-semibold transition-all",
                viewMode === "day"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Colorful Category Filter Legend */}
      <div className="flex items-center gap-2 overflow-x-auto border-t border-border/40 pt-2.5 text-xs">
        <span className="flex items-center gap-1 font-semibold text-muted-foreground shrink-0">
          <Filter className="h-3 w-3" /> Color Palette:
        </span>
        <button
          type="button"
          onClick={() => onSelectColor(null)}
          className={cn(
            "rounded-full px-2.5 py-0.5 font-medium transition-all shrink-0 border",
            selectedColor === null
              ? "bg-foreground text-background border-foreground font-semibold"
              : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted"
          )}
        >
          All Colors
        </button>
        {EVENT_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectColor(selectedColor === c.id ? null : c.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium transition-all shrink-0 border",
              c.bg,
              c.text,
              c.border,
              selectedColor === c.id ? "ring-2 ring-primary ring-offset-1 font-bold shadow-xs" : "opacity-80 hover:opacity-100"
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", c.dot)} />
            {c.name.split("/")[0].trim()}
          </button>
        ))}
      </div>
    </div>
  );
}
