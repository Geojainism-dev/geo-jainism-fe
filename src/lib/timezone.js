// Converts a "wall-clock" datetime-local value (e.g. from an <input type="datetime-local">)
// interpreted AS IF it were the local time in `timeZone`, into a UTC ISO string.
// Standard technique: treat the input as UTC, see how that instant reads in the
// target zone, then correct by the resulting offset.
export function zonedTimeToUtcISOString(dateTimeLocalValue, timeZone) {
  const [datePart, timePart] = dateTimeLocalValue.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(utcGuess)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  const offset = asIfUtc - utcGuess.getTime();

  return new Date(utcGuess.getTime() - offset).toISOString();
}

// Converts a UTC ISO string into the "YYYY-MM-DDTHH:mm" value an
// <input type="datetime-local"> expects, as it would read in `timeZone`.
export function utcToZonedDateTimeLocalValue(isoString, timeZone) {
  const date = new Date(isoString);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(date)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

// Minutes east of UTC for `timeZone` at `date` (negative west of UTC),
// via the same "read the wall-clock, diff against the UTC instant" trick
// used above — works for any IANA zone without a lookup table, DST included.
export function getTimezoneOffsetMinutes(timeZone, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(date)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  // Timezone offsets are always whole minutes; the subtraction above carries
  // sub-second drift from `date`'s milliseconds vs. the second-granularity
  // formatted parts, so round it away.
  return Math.round((asUTC - date.getTime()) / 60000);
}

// Formats an offset in minutes as "UTC+05:30" / "UTC-08:00".
export function formatUtcOffset(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const minutes = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
}
