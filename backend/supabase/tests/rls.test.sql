begin;
create extension if not exists pgtap with schema extensions;
select plan(10);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000091', 'rls-reader@example.test'),
  ('00000000-0000-0000-0000-000000000092', 'rls-admin@example.test');
insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-000000000092');
insert into public.posts (id,title,excerpt) values ('rls-post','Public article','Visible content');
insert into public.products (id,title,description,link) values ('rls-product','Public product','Visible product','https://example.test');

set local role anon;
select is((select count(*)::integer from public.posts where id='rls-post'), 1, 'Anonymous visitors read posts');
select is((select count(*)::integer from public.products where id='rls-product'), 1, 'Anonymous visitors read products');
select throws_ok($$insert into public.posts (title,excerpt) values ('Bad','Bad')$$, '42501', null, 'Anonymous visitors cannot write');
select throws_ok($$select * from public.admin_users$$, '42501', null, 'Anonymous visitors cannot read administrators');

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000091', true);
select throws_ok($$insert into public.posts (title,excerpt) values ('Bad','Bad')$$, '42501', null, 'Non-admin users cannot create posts');
select throws_ok($$insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-000000000091')$$, '42501', null, 'Users cannot promote themselves');
select results_eq($$with changed as (update public.products set title='Bad' where id='rls-product' returning id) select count(*)::integer from changed$$, array[0], 'Non-admin updates affect no rows');
select results_eq($$with removed as (delete from public.posts where id='rls-post' returning id) select count(*)::integer from removed$$, array[0], 'Non-admin deletes affect no rows');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000092', true);
select lives_ok($$insert into public.posts (id,title,excerpt) values ('rls-admin-post','Created by admin','Allowed')$$, 'Admin creates content');
select results_eq($$with changed as (update public.products set title='Updated by admin' where id='rls-product' returning id) select count(*)::integer from changed$$, array[1], 'Admin updates content');
select * from finish();
rollback;
