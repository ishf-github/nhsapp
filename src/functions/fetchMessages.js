import { supabase } from '../supabaseClient';

// Fetch messages between two users
export async function fetchMessages(userId1, userId2) {
  try {
    // Query 'messages' table in Supabase to fetch messages involving either user
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_clinician_id.eq.${userId1},receiver_clinician_id.eq.${userId1},sender_patient_id.eq.${userId1},receiver_patient_id.eq.${userId1}`)
      .or(`sender_clinician_id.eq.${userId2},receiver_clinician_id.eq.${userId2},sender_patient_id.eq.${userId2},receiver_patient_id.eq.${userId2}`)
      // Order messages by timestamp
      .order('timestamp', { ascending: true }); 

    if (error) {
      throw error; 
    } else {
      return data; 
    }
  } catch (err) {
    throw err; 
  }
}
