export function normalizeAnswer(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

export function makeTestCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
