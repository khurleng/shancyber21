export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function validateContent(kind, input, partial = false) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new ApiError('A JSON object is required.');
  }
  const fields = kind === 'posts'
    ? { title: 200, excerpt: 2000, date: 80, image: 2048, content: 0 }
    : { title: 200, description: 2000, buttonText: 40, image: 2048, link: 2048 };
  const required = kind === 'posts' ? ['title', 'excerpt'] : ['title', 'description', 'link'];
  const result = {};
  for (const [key, value] of Object.entries(input)) {
    if (!Object.hasOwn(fields, key)) throw new ApiError(`Unknown field: ${key}`);
    if (key === 'content') {
      if (!Array.isArray(value) || value.length > 500 || value.some(v => typeof v !== 'string' || v.length > 20000)) {
        throw new ApiError('Content must be an array of up to 500 text paragraphs.');
      }
      result[key] = value;
      continue;
    }
    if (typeof value !== 'string' || value.trim().length > fields[key]) throw new ApiError(`Invalid ${key}.`);
    const clean = value.trim();
    if (['title', 'excerpt', 'description', 'buttonText', 'date'].includes(key) && !clean) throw new ApiError(`${key} cannot be empty.`);
    if (key === 'date' && Number.isNaN(Date.parse(clean))) throw new ApiError('Invalid publication date.');
    if (key === 'link' || (key === 'image' && clean && !/^\/(?!\/)/.test(clean))) {
      let url;
      try { url = new URL(clean); } catch { throw new ApiError(`Invalid ${key} URL.`); }
      if (!['https:', 'http:'].includes(url.protocol)) throw new ApiError(`${key} must use HTTP or HTTPS.`);
    }
    result[key] = key === 'image' && !clean ? '/img/hero.png' : clean;
  }
  if (!partial && required.some(key => !result[key])) throw new ApiError(`${required.join(', ')} are required.`);
  if (partial && !Object.keys(result).length) throw new ApiError('Provide at least one field to update.');
  return result;
}

export function assertSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) throw new ApiError('Cross-origin writes are not allowed.', 403);
  if (request.headers.get('sec-fetch-site') === 'cross-site') throw new ApiError('Cross-site writes are not allowed.', 403);
}
