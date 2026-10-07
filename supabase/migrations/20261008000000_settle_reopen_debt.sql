-- US-39 (#229), ADR-037 §1 y §3: saldar una deuda y deshacerlo, solo por RPC.
-- settle_debt pasa pending → settled con settled_at = now() (el reloj del servidor, no el del
-- cliente: C1, I9); reopen_debt pasa settled → pending con settled_at = null. "Deshacer" de US-39
-- usa reopen_debt; US-40 agrega su botón.
-- Una deuda inexistente, de otro usuario o vinculada a un gasto con baja lógica (ADR-037 §4)
-- responde lo mismo, 'La deuda no existe', para no revelar cuál de los tres casos es (C7).
--
-- Además se quita el UPDATE directo sobre debts (CA-7): con él, el cliente podía fijar status y
-- settled_at a mano o cambiar cualquier columna. INSERT y DELETE directos siguen hasta que
-- create_debt (US-36) los reemplace.

create function public.settle_debt(p_debt_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user   uuid := auth.uid();
  v_status public.debt_status;
begin
  if v_user is null then
    raise exception 'settle_debt requiere una sesión' using errcode = '42501';
  end if;

  -- FOR UPDATE: dos pestañas que saldan a la vez se ordenan y la segunda ve 'settled'.
  select d.status into v_status
    from public.debts d
    left join public.transactions t on t.id = d.transaction_id
   where d.id = p_debt_id
     and d.user_id = v_user
     and t.deleted_at is null
     for update of d;

  if not found then
    raise exception 'La deuda no existe' using errcode = 'check_violation';
  end if;
  if v_status = 'settled' then
    raise exception 'La deuda ya está saldada' using errcode = 'check_violation';
  end if;

  update public.debts
     set status = 'settled', settled_at = now()
   where id = p_debt_id;
end $$;

create function public.reopen_debt(p_debt_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user   uuid := auth.uid();
  v_status public.debt_status;
begin
  if v_user is null then
    raise exception 'reopen_debt requiere una sesión' using errcode = '42501';
  end if;

  select d.status into v_status
    from public.debts d
    left join public.transactions t on t.id = d.transaction_id
   where d.id = p_debt_id
     and d.user_id = v_user
     and t.deleted_at is null
     for update of d;

  if not found then
    raise exception 'La deuda no existe' using errcode = 'check_violation';
  end if;
  if v_status = 'pending' then
    raise exception 'La deuda ya está pendiente' using errcode = 'check_violation';
  end if;

  update public.debts
     set status = 'pending', settled_at = null
   where id = p_debt_id;
end $$;

revoke execute on function public.settle_debt(uuid) from public, anon;
revoke execute on function public.reopen_debt(uuid) from public, anon;
grant execute on function public.settle_debt(uuid) to authenticated;
grant execute on function public.reopen_debt(uuid) to authenticated;

revoke update on public.debts from authenticated;
drop policy update_own_rows on public.debts;
