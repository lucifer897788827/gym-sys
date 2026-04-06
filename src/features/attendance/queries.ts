const dayInMs = 24 * 60 * 60 * 1000;

function normalizeVisitDate(value: string) {
  const day = value.slice(0, 10);
  const timestamp = Date.parse(`${day}T00:00:00.000Z`);

  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid visit date: ${value}`);
  }

  return timestamp;
}

export function calculateAttendanceStreak(visitDates: string[]) {
  const uniqueVisitDays = [...new Set(visitDates.map(normalizeVisitDate))].sort((a, b) => a - b);

  if (uniqueVisitDays.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  let bestStreak = 1;
  let runningBestStreak = 1;

  for (let index = 1; index < uniqueVisitDays.length; index += 1) {
    if (uniqueVisitDays[index] - uniqueVisitDays[index - 1] === dayInMs) {
      runningBestStreak += 1;
    } else {
      runningBestStreak = 1;
    }

    bestStreak = Math.max(bestStreak, runningBestStreak);
  }

  let currentStreak = 1;

  for (let index = uniqueVisitDays.length - 1; index > 0; index -= 1) {
    if (uniqueVisitDays[index] - uniqueVisitDays[index - 1] === dayInMs) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return { currentStreak, bestStreak };
}
