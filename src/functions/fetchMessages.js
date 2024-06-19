import { supabase } from '../supabaseClient';

export async function fetchMessages(userId1, userId2) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_clinician_id.eq.${userId1},receiver_clinician_id.eq.${userId1},sender_patient_id.eq.${userId1},receiver_patient_id.eq.${userId1}`)
      .or(`sender_clinician_id.eq.${userId2},receiver_clinician_id.eq.${userId2},sender_patient_id.eq.${userId2},receiver_patient_id.eq.${userId2}`)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    } else {
      return data;
    }
  } catch (err) {
    console.error('Unexpected error fetching messages:', err);
    throw err;
  }
}
