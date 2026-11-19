'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { todayPK, isLateNow } from '@/lib/utils';

export async function checkIn() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('attendance').insert({
    user_id: user.id,
    work_date: todayPK(),
    check_in: new Date().toISOString(),
    status: isLateNow() ? 'late' : 'present',
  });
  revalidatePath('/attendance');
  revalidatePath('/dashboard');
}

export async function checkOut() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from('attendance')
    .update({ check_out: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('work_date', todayPK())
    .is('check_out', null);
  revalidatePath('/attendance');
  revalidatePath('/dashboard');
}
