'use client';

import { useEffect, useRef, useState } from 'react';
import { PostContent } from './PostContent';

export function PostEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkError, setLinkError] = useState('');
  const selection = useRef({ start: 0, end: 0 });

  useEffect(() => {
    if (!value.trim()) setPreview(false);
  }, [value]);

  function replace(start: number, end: number, text: string, selectStart = 0, selectEnd = text.length) {
    onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => {
      textarea.current?.focus();
      textarea.current?.setSelectionRange(start + selectStart, start + selectEnd);
    });
  }

  function format(kind: string) {
    const input = textarea.current;
    if (!input) return;
    const { selectionStart: start, selectionEnd: end } = input;
    if (kind === 'link') {
      selection.current = { start, end };
      setLinkOpen(true);
      setLinkError('');
      return;
    }
    if (kind === 'bold' || kind === 'italic') {
      const marker = kind === 'bold' ? '**' : '*';
      const text = value.slice(start, end) || 'text';
      replace(start, end, marker + text + marker, marker.length, marker.length + text.length);
      return;
    }
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const searchEnd = end > start && value[end - 1] === '\n' ? end - 1 : end;
    const nextLine = value.indexOf('\n', searchEnd);
    const lineEnd = nextLine < 0 ? value.length : nextLine;
    const text = value.slice(lineStart, lineEnd).split('\n').map((line, index) => {
      const clean = line.replace(/^(#{1,2}\s+|-\s+|\d+\.\s+)/, '');
      const prefix = kind === 'heading' ? '# ' : kind === 'subheading' ? '## ' : kind === 'bullets' ? '- ' : `${index + 1}. `;
      return prefix + clean;
    }).join('\n');
    replace(lineStart, lineEnd, text);
  }

  function insertLink() {
    let url: URL;
    try {
      url = new URL(linkUrl.trim());
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error();
    } catch {
      setLinkError('Enter a complete HTTP or HTTPS URL.');
      return;
    }
    const { start, end } = selection.current;
    const label = (value.slice(start, end) || 'Link text').replace(/[\[\]\r\n]/g, ' ');
    replace(start, end, `[${label}](${url.href.replace(/\(/g, '%28').replace(/\)/g, '%29')})`);
    setLinkOpen(false);
    setLinkUrl('');
  }

  return <div>
    <label htmlFor="post-content" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Content</label>
    <div className="rounded-md border border-gray-300 dark:border-gray-600">
      <div role="toolbar" aria-label="Post formatting" className="flex flex-wrap gap-2 border-b border-gray-300 p-2 dark:border-gray-600">
        {[
          ['bold', 'Bold'], ['italic', 'Italic'], ['heading', 'Heading'], ['subheading', 'Subheading'],
          ['bullets', 'Bullets'], ['numbered', 'Numbered list'], ['link', 'Link'],
        ].map(([kind, label]) => <button key={kind} type="button" disabled={preview} onClick={() => format(kind)} className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-40 dark:border-gray-600 dark:hover:bg-gray-700">{label}</button>)}
        <button type="button" disabled={!value.trim()} aria-pressed={preview} onClick={() => { setPreview(!preview); setLinkOpen(false); }} className="rounded border border-indigo-400 px-2 py-1 text-sm text-indigo-600 disabled:opacity-40 dark:text-indigo-300">{preview ? 'Edit' : 'Preview'}</button>
      </div>
      {linkOpen && <div className="space-y-2 border-b border-gray-300 p-3 dark:border-gray-600">
        <label htmlFor="post-link" className="block text-sm">Link URL</label>
        <input id="post-link" type="url" value={linkUrl} onChange={event => setLinkUrl(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); insertLink(); } }} placeholder="https://example.com" className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600" />
        {linkError && <p role="alert" className="text-sm text-red-600">{linkError}</p>}
        <button type="button" onClick={insertLink} className="mr-3 text-sm text-indigo-600 dark:text-indigo-300">Insert link</button>
        <button type="button" onClick={() => setLinkOpen(false)} className="text-sm">Cancel</button>
      </div>}
      <textarea ref={textarea} id="post-content" required value={value} onChange={event => onChange(event.target.value)} aria-describedby="post-content-help" hidden={preview} className="shan-text min-h-72 w-full resize-y rounded-b-md bg-transparent px-3 py-3 leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500" />
      {preview && <div aria-label="Post preview" className="min-h-72 p-4">{value.trim() ? <PostContent content={value.split('\n')} /> : <p className="text-gray-500">Your post preview will appear here.</p>}</div>}
    </div>
    <p id="post-content-help" className="mt-2 text-xs text-gray-500">Select text to format it. Headings and lists apply to the current line or selected lines. Each new line becomes a paragraph.</p>
  </div>;
}
