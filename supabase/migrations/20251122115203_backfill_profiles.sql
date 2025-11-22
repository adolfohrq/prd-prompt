-- Insere perfis para usuários que já estão na tabela auth.users mas não na public.profiles
insert into public.profiles (id, email, role)
select id, email, 'user'
from auth.users
where id not in (select id from public.profiles);

