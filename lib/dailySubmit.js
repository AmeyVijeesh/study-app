export const createDailyLog = async (
  userId,
  journal,
  totalTimeFocussed,
  sessionsToday,
  timeTable
) => {
  const date = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

  const res = await fetch('/api/daily-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      date,
      journal,
      totalTimeFocussed,
      sessionsToday,
      timeTable,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
