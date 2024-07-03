import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// Function to send a message
export async function sendMessage(senderId, receiverId, content, senderType) {
  const messageData = {
    message_id: uuidv4(), 
    content: content,
    timestamp: new Date().toISOString(), 
    is_read: false,
  };

  // Assign sender and receiver IDs based on sender type (patient/clinician)
  if (senderType === 'clinician') {
    messageData.sender_clinician_id = senderId;
    messageData.receiver_patient_id = receiverId;
  } else if (senderType === 'patient') {
    messageData.sender_patient_id = senderId;
    messageData.receiver_clinician_id = receiverId;
  } else {
    throw new Error('Invalid sender type');
  }

  // Insert message data into the 'messages' table in Supabase
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData]);

  // Handle errors during insertion
  if (error) {
    throw error;
  // Else return inserted data 
  } else {
    return data; 
  }
}
