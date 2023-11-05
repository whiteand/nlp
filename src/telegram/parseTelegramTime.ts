import { Temporal } from "@js-temporal/polyfill";

interface ITelegramTime {
  edited: Temporal.ZonedDateTime | null;
  original: Temporal.ZonedDateTime | null;
  time: Temporal.ZonedDateTime;
}
const REGEX =
  /^(\d+)\s+(\w+)\s+(\d{4}), (\d{2}):(\d{2}):(\d{2})(\n(Edited|Original): (\d+)\s+(\w+)\s+(\d{4}), (\d{2}):(\d{2}):(\d{2}))?$/;

const MONTHES = new Map(
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((m, ind) => [m, ind + 1])
);
function getMonthNumber(month: string): number {
  const res = MONTHES.get(month);
  if (res == null) {
    throw new Error("unknown month: " + month);
  }
  return res;
}

export function parseTelegramTime(time: string | null): ITelegramTime {
  if (!time) {
    throw new Error("Time is null");
  }
  let match = REGEX.exec(time);
  if (!match) {
    throw new Error("cannot parse time: " + time);
  }
  const date = +match[1];
  const monthString = match[2];
  const year = +match[3];

  const hours = +match[4];
  const minutes = +match[5];
  const seconds = +match[6];
  const additional = match[8];
  const additionalDate = +match[9];
  const additionalMonth = match[10] && getMonthNumber(match[10]);
  const additionalYear = +match[11];
  const additionalHours = +match[12];
  const additionalMinutes = +match[13];
  const additionalSeconds = +match[14];
  const additionalDateTime = !!additionalMonth
    ? Temporal.ZonedDateTime.from({
        timeZone: "Europe/Kyiv",
        year: additionalYear,
        month: additionalMonth,
        day: additionalDate,
        hour: additionalHours,
        minute: additionalMinutes,
        second: additionalSeconds,
        calendar: "iso8601",
      })
    : null;

  const options: Temporal.ZonedDateTimeLike = {
    timeZone: "Europe/Kyiv",
    year: year,
    month: getMonthNumber(monthString),
    day: date,
    hour: hours,
    minute: minutes,
    second: seconds,
    calendar: "iso8601",
  };

  const zonedDateTime = Temporal.ZonedDateTime.from(options);

  return {
    edited: additional === "Edited" ? additionalDateTime : null,
    original: additional === "Original" ? additionalDateTime : null,
    time: zonedDateTime,
  };
}
