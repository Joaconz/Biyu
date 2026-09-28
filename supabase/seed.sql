-- Datos de prueba SOLO para desarrollo local (supabase db reset, o psql -f). Montos y nombres
-- ficticios (C14). No es el set inicial de FR-04: ese lo siembra US-43 (#57, ADR-014) para cada
-- usuario nuevo. Esto crea un usuario demo con categorías y cuentas para poder usar /register.
--
-- Login local: demo@biyu.test / biyu-demo-local (solo existe en el Supabase de tu máquina).
-- Idempotente: se puede correr sobre una base que ya lo tiene.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000', 'de000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated', 'demo@biyu.test',
  extensions.crypt('biyu-demo-local', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
) on conflict (id) do nothing;

insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  'de000000-0000-0000-0000-000000000001', 'de000000-0000-0000-0000-000000000001',
  '{"sub":"de000000-0000-0000-0000-000000000001","email":"demo@biyu.test","email_verified":true}',
  'email', now(), now(), now()
) on conflict do nothing;

-- Si #57 ya sembró categorías con el mismo nombre, el índice único parcial frena el duplicado.
insert into public.categories (user_id, name) values
  ('de000000-0000-0000-0000-000000000001', 'Comida y supermercado'),
  ('de000000-0000-0000-0000-000000000001', 'Transporte'),
  ('de000000-0000-0000-0000-000000000001', 'Servicios'),
  ('de000000-0000-0000-0000-000000000001', 'Entretenimiento'),
  ('de000000-0000-0000-0000-000000000001', 'Salud'),
  ('de000000-0000-0000-0000-000000000001', 'Educación'),
  ('de000000-0000-0000-0000-000000000001', 'Indumentaria'),
  ('de000000-0000-0000-0000-000000000001', 'Otros')
on conflict do nothing;

-- Una categoría archivada, para ver que no aparece en el formulario (US-06).
insert into public.categories (user_id, name, archived_at)
select 'de000000-0000-0000-0000-000000000001', 'Salidas', now()
where not exists (
  select 1 from public.categories
   where user_id = 'de000000-0000-0000-0000-000000000001' and name = 'Salidas'
);

insert into public.accounts (user_id, name, type, currency) values
  ('de000000-0000-0000-0000-000000000001', 'Tarjeta de crédito', 'credit_card', 'ARS'),
  ('de000000-0000-0000-0000-000000000001', 'Tarjeta de débito', 'debit_card', 'ARS'),
  ('de000000-0000-0000-0000-000000000001', 'Efectivo', 'cash', 'ARS'),
  ('de000000-0000-0000-0000-000000000001', 'Cuenta bancaria', 'bank_account', 'ARS'),
  ('de000000-0000-0000-0000-000000000001', 'Billetera virtual', 'wallet', 'ARS')
on conflict do nothing;
