# Shan Cyber Supabase backend

This folder contains the local Supabase configuration, versioned database migration,
public-content seed, validation, and tests. The Next.js API routes are the server
adapter; no second HTTP server is required.

## Start locally

Requires Node.js 20+ and a running Docker-compatible engine (for example Docker
Desktop). The Supabase CLI is pinned as a development dependency in the root project.
Run from the **project root**:

```powershell
npm.cmd ci
npm.cmd run backend:start
Copy-Item .env.example .env.local
```

Edit `.env.local` with the local project URL and **publishable key** displayed by
the CLI. A legacy **anon** key also works. Do not use a service-role or secret key;
the application intentionally relies on RLS rather than bypassing it.

```dotenv
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_PUBLISHABLE_KEY=your-local-publishable-or-anon-key
```

Start Next.js separately with `npm.cmd run dev`. Restart Next.js after changing env
values. The site URL is `http://localhost:3000`; local Supabase Studio is
`http://127.0.0.1:54323`. First startup applies migrations and imports the seed.
Use `npm.cmd run backend:stop` to stop Supabase without deleting local data.

## Create the first administrator

1. Open local Studio → Authentication → Users → Add user. Create an email/password
   user, confirm their email, and use a password of at least 12 characters.
2. Copy their user UUID and run this in Studio's SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('REPLACE_WITH_AUTH_USER_UUID')
on conflict do nothing;
```

3. Visit `/admin` and sign in with that email and password.

Public signup is disabled in the local configuration. There is no seeded admin
password. The old `src/data/admin.json` is no longer read or imported.
Only a database owner can appoint admins; signing up does not grant admin access.
Remove a row from `admin_users` to immediately block that user's next admin request.

## Data and API

- `posts`: existing text IDs, titles, publication dates, excerpts, paragraph arrays,
  image URLs, and creation/update timestamps.
- `products`: existing text IDs, descriptions, button labels, image URLs, external
  links, and timestamps. Existing links/IDs are retained by the seed.
- `admin_users`: approved Supabase Auth user IDs, with self-only read access.
- Public visitors can read posts/products. Only approved admins can write.
- Images remain URLs; this setup does not upload files or create a Storage bucket.

| Route | Methods | Access |
| --- | --- | --- |
| `/api/posts`, `/api/products` | GET | Public |
| `/api/posts`, `/api/products` | POST | Admin |
| `/api/posts/:id`, `/api/products/:id` | GET | Public |
| `/api/posts/:id`, `/api/products/:id` | PUT, DELETE | Admin |
| `/api/admin/login` | POST `{email,password}` | Login |
| `/api/admin/session` | GET | Admin |
| `/api/admin/logout` | POST | Current session |
| `/api/admin/password` | POST `{currentPassword,newPassword}` | Admin |

Login stores the access token in an HttpOnly, SameSite cookie, Secure in production.
Sessions last one hour by default and require login again after expiry; this first
version does not persist or rotate refresh tokens. Logout revokes the Supabase
session and clears the cookie. Supabase access JWTs may remain valid until expiry;
removing admin membership blocks their write permissions immediately.
API handlers verify the user and admin membership before writes, validate fields,
and reject cross-origin browser writes. Database RLS also protects direct API calls.
Supabase Auth applies its authentication rate limits; adjust those in hosted project
settings before exposing a deployment.

When both env variables are blank, reads use the existing JSON as a **read-only
preview**. Admin login returns 503 and writes require authentication. Partial env
configuration and database outages produce errors, never silently fall back to JSON.

## Verify

```powershell
npm.cmd run backend:test
npm.cmd run backend:db:test
npm.cmd run build
```

With Next.js running, `node backend/tests/smoke.mjs` checks public pages, public
API reads, missing-record handling, unauthenticated write rejection, cross-origin
login rejection, invalid JSON, and logout cookies without changing content.

The first command tests input validation and cross-origin checks with Node. The
database test requires running local Supabase and uses a rolled-back transaction
to check public reads, anonymous/non-admin write denial, self-promotion denial,
and admin writes. For a live smoke test, sign in at `/admin`, create/edit/delete a
temporary post and product, confirm public pages update, then sign out and verify
unauthenticated writes return 401.

`npm.cmd run backend:seed` regenerates SQL from `src/data/posts.json` and
`src/data/products.json`. It imports only public content and does not overwrite
existing IDs. On an existing local database, apply the seed through Studio's SQL
Editor if wanted; rebuilding the seed does not mutate a running database. Avoid
resetting a database that contains work you need to retain.

## Connect a hosted project later

Create a Supabase project, apply `supabase/migrations/202609290001_content.sql`
using its SQL Editor, and optionally apply `supabase/seed.sql`. Create/appoint an
admin as above. Set the hosted project URL and publishable key in your deployment
environment, configure Auth site URL/redirects and disable public signup in the
hosted dashboard, then restart/redeploy Next.js. Local `config.toml` settings do
not automatically change hosted project settings. No hosted resources are created
by this repository setup.

References: [Supabase local development](https://supabase.com/docs/guides/local-development/cli/getting-started),
[API keys](https://supabase.com/docs/guides/getting-started/api-keys),
[Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).
