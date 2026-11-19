import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isManager, ROLE_LABEL } from '@/lib/utils';
import { signOut } from './actions';

export default async function AppLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile || !profile.active) {
    await supabase.auth.signOut();
    redirect('/login');
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Hospital Portal</div>
        <nav>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/attendance">Attendance</Link>
          {isManager(profile) && <Link href="/staff">Staff</Link>}
        </nav>
        <div className="me">
          <strong>{profile.full_name || profile.email}</strong>
          <span>{ROLE_LABEL[profile.role]}</span>
          <form action={signOut}>
            <button className="link-btn">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
