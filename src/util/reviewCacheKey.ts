import crypto from 'crypto';

// Cache key for review extraction
export function reviewExtractionCacheKey(text: string) {
  const normalized = text.trim().replace(/\s+/g, ' ');
  return `review:extract:${crypto
    .createHash('sha256')
    .update(normalized)
    .digest('hex')}`;
}

// Cache key for clapbac review generation

export function clapbacReviewGenerationCacheKey(payload: {
  context: string;
  prompt: string;
  tone: string;
  lengthInWords: number;
  useHashTags: boolean;
  useEmojis: boolean;
  resultCount: number;
}) {
  const normalizedPayload = {
    context: payload.context?.trim().replace(/\s+/g, ' ') || '',
    prompt: payload.prompt?.trim().replace(/\s+/g, ' ') || '',
    tone: payload.tone?.trim().toLowerCase() || '',
    lengthInWords: payload.lengthInWords || 0,
    useHashTags: !!payload.useHashTags,
    useEmojis: !!payload.useEmojis,
    resultCount: payload.resultCount || 1,
  };

  return `review:generate:${crypto
    .createHash('sha256')
    .update(JSON.stringify(normalizedPayload))
    .digest('hex')}`;
}
