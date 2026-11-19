import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isManager, ROLE_LABEL } from '@/lib/utils';
import AddStaffForm from '@/components/AddStaffForm';
import { toggleActive } from './actions';

export default async function StaffPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: me } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!isManager(me)) redirect('/dashboard');

  const { data: staff } = await supabase.from('profiles').select('*').order('full_name');

  return (
    <>
      <h1>Staff</h1>

      <section className="panel">
        <h2>Naya staff member</h2>
        <AddStaffForm />
      </section>

      <section className="panel">
        <h2>Sab staff ({staff?.length || 0})</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Naam</th><th>Role</th><th>Department</th><th>Designation</th><th>Phone</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {staff?.map((s) => (
                <tr key={s.id} className={s.active ? '' : 'inactive'}>
                  <td>{s.full_name}<br /><small className="muted">{s.email}</small></td>
                  <td>{ROLE_LABEL[s.role]}</td>
                  <td>{s.department || '-'}</td>
                  <td>{s.designation || '-'}</td>
                  <td>{s.phone || '-'}</td>
                  <td><span className={`tag ${s.active ? 'present' : 'late'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    {s.id !== me.id && (
                      <form action={toggleActive}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="active" value={String(s.active)} />
                        <button className="link-btn">{s.active ? 'Deactivate' : 'Activate'}</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
