import { supabase } from '../supabaseClient';
import { goto } from '$app/navigation';

export async function checkClinicianAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    goto('/clinician-signin');
    return null;
  }

  const clinicianId = session.user.id;
  const { data: clinician, error } = await supabase
    .from('clinicians')
    .select('first_name, last_name, clinician_id')
    .eq('clinician_id', clinicianId)
    .single();

  if (error || !clinician) {
    goto('/clinician-signin');
    return null;
  }

  return clinician;
}
