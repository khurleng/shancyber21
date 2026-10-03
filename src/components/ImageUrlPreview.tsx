'use client';

import { useState } from 'react';

export function ImageUrlPreview({ src }: { src: string }) {
  const url = src.trim();
  return (
    <div className="mt-2">
      <p className="text-xs text-gray-500">
        Use a direct image URL (Copy image address), or a local path such as /img/hero.png.
      </p>
      {url ? <Preview key={url} src={url} /> : null}
    </div>
  );
}

function Preview({ src }: { src: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className="mt-2">
      {/* External images are loaded directly, using the same policy as published content. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Image preview"
        referrerPolicy="no-referrer"
        className={`max-h-40 max-w-full rounded-md object-contain ${status === 'error' ? 'hidden' : ''}`}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
      <p className={`mt-1 text-xs ${status === 'error' ? 'text-red-600' : 'text-gray-500'}`} role="status">
        {status === 'loading' && 'Loading image preview…'}
        {status === 'loaded' && 'Image loaded successfully.'}
        {status === 'error' && 'This image could not be loaded. Check that the URL points directly to a public image. The website may block embedding; try hosting the image on your own site.'}
      </p>
    </div>
  );
}
