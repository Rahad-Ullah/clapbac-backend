import crypto from 'crypto';

export function reviewCacheKey(text: string) {
  const normalized = text.trim().replace(/\s+/g, ' ');
  return `review:extract:${crypto
    .createHash('sha256')
    .update(normalized)
    .digest('hex')}`;
}
