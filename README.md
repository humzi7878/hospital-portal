# Hospital Staff Portal (Phase 1)

Next.js 14 + Supabase. Is phase mein: login, roles (admin, hr, doctor, nurse), staff management, attendance, dashboard.

## 1. Supabase setup
1. supabase.com par naya project banayein.
2. SQL Editor kholein, `supabase/schema.sql` ka poora content paste kar ke Run karein.
3. Authentication > Users > Add user se apna pehla user banayein (email + password, "Auto confirm" on).
4. SQL Editor mein usay admin banayein:
   ```sql
   update public.profiles set role = 'admin', full_name = 'Aap ka naam' where email = 'aap-ki-email@example.com';
   ```
5. Project Settings > API se teen cheezein copy karein: Project URL, anon key, service_role key.

## 2. Local chalana (optional)
```bash
npm install
cp .env.example .env.local   # values bhar dein
npm run dev
```

## 3. Vercel par live
1. Is folder ko GitHub repository mein upload karein.
2. Vercel mein "Add New Project" > repository select karein.
3. Environment Variables mein yeh teen add karein:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy dabayein.

`SUPABASE_SERVICE_ROLE_KEY` secret hai. Isay kabhi GitHub par ya browser code mein na dalein.

## Agla phase
Salary module (payslip), complaints/requests (approve/reject), chhutti requests.
