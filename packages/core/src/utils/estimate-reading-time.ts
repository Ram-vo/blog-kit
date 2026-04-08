export function estimateReadingTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
