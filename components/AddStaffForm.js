'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addStaff } from '@/app/(app)/staff/actions';
import { ROLES, ROLE_LABEL } from '@/lib/utils';

function Submit() {
  const { pending } = useFormStatus();
  return <button className="btn" disabled={pending}>{pending ? 'Saving...' : 'Add staff member'}</button>;
}

export default function AddStaffForm() {
  const [state, action] = useFormState(addStaff, null);

  return (
    <form action={action} className="form-grid">
      <label>Poora naam<input name="full_name" required /></label>
      <label>Email<input name="email" type="email" required /></label>
      <label>Temporary password<input name="password" type="text" minLength={8} required /></label>
      <label>Role
        <select name="role" defaultValue="nurse">
          {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
      </label>
      <label>Department<input name="department" placeholder="e.g. Emergency" /></label>
      <label>Designation<input name="designation" placeholder="e.g. Staff Nurse" /></label>
      <label>Phone<input name="phone" /></label>
      <label>Basic salary (PKR)<input name="salary_basic" type="number" min="0" step="500" /></label>
      <div className="form-foot">
        <Submit />
        {state?.error && <p className="error" role="alert">{state.error}</p>}
        {state?.ok && <p className="success" role="status">{state.ok}</p>}
      </div>
    </form>
  );
}
