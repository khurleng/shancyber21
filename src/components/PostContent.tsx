import { Fragment } from 'react';

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^\s)]+\))/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
    if (link) {
      try {
        const url = new URL(link[2]);
        if (['https:', 'http:'].includes(url.protocol)) {
          return <a key={index} href={url.href} className="text-indigo-600 underline dark:text-indigo-400">{link[1]}</a>;
        }
      } catch { /* Invalid links remain plain text. */ }
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function PostContent({ content }: { content: string[] }) {
  const lines = content.flatMap(paragraph => paragraph.split('\n')).map(line => line.trim()).filter(Boolean);
  const blocks = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const heading = line.match(/^(#{1,2})\s+(.+)$/);
    if (heading) {
      blocks.push(heading[1] === '#'
        ? <h2 key={index} className="text-2xl font-bold leading-relaxed">{inline(heading[2])}</h2>
        : <h3 key={index} className="text-xl font-semibold leading-relaxed">{inline(heading[2])}</h3>);
      continue;
    }
    const listPattern = /^(-\s+|\d+\.\s+)(.+)$/;
    const list = line.match(listPattern);
    if (list) {
      const start = index;
      const ordered = /^\d/.test(list[1]);
      const items = [];
      while (index < lines.length) {
        const item = lines[index].match(listPattern);
        if (!item || /^\d/.test(item[1]) !== ordered) break;
        items.push(<li key={index}>{inline(item[2])}</li>);
        index++;
      }
      index--;
      blocks.push(ordered
        ? <ol key={start} start={parseInt(list[1], 10)} className="list-decimal space-y-2 pl-6 text-lg leading-8">{items}</ol>
        : <ul key={start} className="list-disc space-y-2 pl-6 text-lg leading-8">{items}</ul>);
      continue;
    }
    blocks.push(<p key={index} className="text-lg leading-8 text-gray-700 dark:text-gray-300">{inline(line)}</p>);
  }
  return <div className="shan-text space-y-5">{blocks}</div>;
}
