/** 83456 → "1:23.4" */
export function formatTime(ms: number): string {
  const total = Math.max(0, Math.round(ms / 100)) / 10;
  const min = Math.floor(total / 60);
  const sec = (total - min * 60).toFixed(1).padStart(4, "0");
  return `${min}:${sec}`;
}
