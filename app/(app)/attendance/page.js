import { createClient } from '@/lib/supabase/server';
import { isManager, todayPK, fmtTime, fmtDate } from '@/lib/utils';
import { checkIn, checkOut } from './actions';

export default async function AttendancePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const today = todayPK();

  const { data: history } = await supabase
    .from('attendance').select('*').eq('user_id', user.id)
    .order('work_date', { ascending: false }).limit(30);
  const mine = history?.find((r) => r.work_date === today);

  let everyone = [];
  if (isManager(profile)) {
    const { data } = await supabase
      .from('attendance')
      .select('*, profiles(full_name, department, role)')
      .eq('work_date', today)
      .order('check_in', { ascending: true });
    everyone = data || [];
  }

  return (
    <>
      <h1>Attendance</h1>

      <section className="panel">
        <h2>Aaj, {fmtDate(today)}</h2>
        <div className="row">
          <form action={checkIn}>
            <button className="btn" disabled={!!mine}>Check in</button>
          </form>
          <form action={checkOut}>
            <button className="btn secondary" disabled={!mine || !!mine.check_out}>Check out</button>
          </form>
          <p className="muted">
            {mine ? `Check-in ${fmtTime(mine.check_in)} | Check-out ${fmtTime(mine.check_out)}` : 'Aaj abhi check-in nahi kiya.'}
          </p>
        </div>
      </section>

      {isManager(profile) && (
        <section className="panel">
          <h2>Aaj sab staff</h2>
          {everyone.length === 0 ? (
            <p className="muted">Abhi kisi ne check-in nahi kiya.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Naam</th><th>Department</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr></thead>
                <tbody>
                  {everyone.map((r) => (
                    <tr key={r.id}>
                      <td>{r.profiles?.full_name}</td>
                      <td>{r.profiles?.department || '-'}</td>
                      <td>{fmtTime(r.check_in)}</td>
                      <td>{fmtTime(r.check_out)}</td>
                      <td><span className={`tag ${r.status}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <section className="panel">
        <h2>Meri pichli 30 din ki attendance</h2>
        {history?.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr></thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id}>
                    <td>{fmtDate(r.work_date)}</td>
                    <td>{fmtTime(r.check_in)}</td>
                    <td>{fmtTime(r.check_out)}</td>
                    <td><span className={`tag ${r.status}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">Abhi koi record nahi hai.</p>
        )}
      </section>
    </>
  );
}
