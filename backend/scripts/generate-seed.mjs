import { readFile, writeFile } from 'node:fs/promises';

// Content only: never import the old plaintext admin configuration.
const root = new URL('../../', import.meta.url);
const quote = value => "'" + String(value).replaceAll("'", "''") + "'";
const statements = ['-- Generated from existing public content; no credentials.', 'begin;'];
for (const table of ['posts', 'products']) {
  const rows = JSON.parse((await readFile(new URL(`src/data/${table}.json`, root), 'utf8')).replace(/^\uFEFF/, ''));
  const fields = table === 'posts'
    ? ['id', 'title', 'date', 'excerpt', 'content', 'image']
    : ['id', 'title', 'description', 'buttonText', 'image', 'link'];
  for (const [index, row] of rows.entries()) {
    const values = fields.map(field => field === 'content'
      ? `ARRAY[${row.content.map(quote).join(',')}]::text[]`
      : quote(row[field]));
    // Preserve the current product ordering when sorting by created_at descending.
    statements.push(`insert into public.${table} (${fields.map(f => `"${f}"`).join(',')}, created_at) values (${values.join(',')}, now() - interval '${index} seconds') on conflict (id) do nothing;`);
  }
}
statements.push('commit;', '');
await writeFile(new URL('backend/supabase/seed.sql', root), statements.join('\n'));
console.log('Generated backend/supabase/seed.sql from public content.');
