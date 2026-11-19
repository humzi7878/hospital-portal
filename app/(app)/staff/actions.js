'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isManager, ROLES } from '@/lib/utils';

async function requireManager() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return isManager(profile) ? profile : null;
}

export async function addStaff(prevState, formData) {
  const me = await requireManager();
  if (!me) return { error: 'Aap ko yeh kaam karne ki ijazat nahi hai.' };

  const full_name = String(formData.get('full_name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const role = String(formData.get('role') || 'nurse');
  const department = String(formData.get('department') || '').trim();
  const designation = String(formData.get('designation') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const salary = Number(formData.get('salary_basic') || 0);

  if (!full_name || !email) return { error: 'Naam aur email zaroori hain.' };
  if (password.length < 8) return { error: 'Password kam az kam 8 characters ka hona chahiye.' };
  if (!ROLES.includes(role)) return { error: 'Role galat hai.' };
  if (role === 'admin' && me.role !== 'admin') return { error: 'Sirf admin naya admin bana sakta hai.' };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role, department, designation, phone },
  });
  if (error) return { error: error.message };

  await admin.from('profiles').update({ salary_basic: salary }).eq('id', data.user.id);

  revalidatePath('/staff');
  return { ok: `${full_name} add ho gaya/gayi.` };
}

export async function toggleActive(formData) {
  const me = await requireManager();
  if (!me) return;
  const id = String(formData.get('id'));
  const active = formData.get('active') === 'true';
  if (id === me.id) return; // apne aap ko deactivate nahi kar sakte
  const supabase = createClient();
  await supabase.from('profiles').update({ active: !active }).eq('id', id);
  revalidatePath('/staff');
}
