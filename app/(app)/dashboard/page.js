import { createClient } from '@/lib/supabase/server';
import { isManager, todayPK, fmtTime } from '@/lib/utils';

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const today = todayPK();

  if (!isManager(profile)) {
    const { data: mine } = await supabase
      .from('attendance').select('*').eq('user_id', user.id).eq('work_date', today).maybeSingle();
    return (
      <>
        <h1>Salam, {profile.full_name || 'team'}</h1>
        <div className="stats">
          <div className="stat"><span>Aaj ki attendance</span><b>{mine ? (mine.status === 'late' ? 'Late' : 'Present') : 'Not marked'}</b></div>
          <div className="stat"><span>Check-in</span><b>{fmtTime(mine?.check_in)}</b></div>
          <div className="stat"><span>Check-out</span><b>{fmtTime(mine?.check_out)}</b></div>
        </div>
      </>
    );
  }

  const [{ count: total }, { data: rows }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('attendance').select('status').eq('work_date', today),
  ]);
  const present = rows?.length || 0;
  const late = rows?.filter((r) => r.status === 'late').length || 0;
  const absent = Math.max((total || 0) - present, 0);

  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat"><span>Total staff</span><b>{total || 0}</b></div>
        <div className="stat"><span>Aaj present</span><b>{present}</b></div>
        <div className="stat"><span>Late aaye</span><b>{late}</b></div>
        <div className="stat"><span>Abhi tak check-in nahi</span><b>{absent}</b></div>
      </div>
    </>
  );
}
