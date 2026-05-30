const buckets = new Map();

export function assertRateLimit(name, maxRequests, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(name)?.filter((timestamp) => now - timestamp < windowMs) || [];
  if (bucket.length >= maxRequests) {
    const seconds = Math.ceil((windowMs - (now - bucket[0])) / 1000);
    throw new Error(`Terlalu banyak permintaan. Coba lagi dalam ${seconds} detik.`);
  }
  bucket.push(now);
  buckets.set(name, bucket);
}
