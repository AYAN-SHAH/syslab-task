import { DateTime } from 'luxon';

// Convert a local date/time string in a given IANA timezone into a JS Date (UTC)
export function toUtc(dateString, timezone) {
  // dateString can be ISO-like or 'yyyy-MM-dd HH:mm'
  const zoned = DateTime.fromISO(dateString, { zone: timezone });
  if (!zoned.isValid) {
    throw new Error('Invalid date or timezone');
  }
  return zoned.toUTC().toJSDate();
}

// Convert a stored UTC JS Date to an ISO string in the event's timezone (frontend can format)
export function fromUtcToZone(dateUtc, timezone) {
  return DateTime.fromJSDate(dateUtc, { zone: 'utc' }).setZone(timezone).toISO();
}

