const TZ = 'Asia/Karachi';

export const ROLES = ['admin', 'hr', 'doctor', 'nurse'];
export const ROLE_LABEL = { admin: 'Admin', hr: 'HR', doctor: 'Doctor', nurse: 'Nurse' };

export function todayPK() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ }); // YYYY-MM-DD
}

export function fmtTime(ts) {
  if (!ts) return '-';
  return new Date(ts).toLocaleTimeString('en-PK', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
}

export function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function isLateNow() {
  const parts = new Date().toLocaleTimeString('en-GB', { timeZone: TZ, hour12: false }).split(':');
  const minutes = Number(parts[0]) * 60 + Number(parts[1]);
  return minutes > 9 * 60 + 30; // 09:30 ke baad late
}

export function isManager(profile) {
  return profile && ['admin', 'hr'].includes(profile.role);
}
