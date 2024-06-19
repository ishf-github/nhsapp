import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export async function sendMessage(senderId, receiverId, content, senderType) {
  const messageData = {
    message_id: uuidv4(),
    content: content,
    timestamp: new Date().toISOString(),
    is_read: false,
  };

  if (senderType === 'clinician') {
    messageData.sender_clinician_id = senderId;
    messageData.receiver_patient_id = receiverId;
  } else if (senderType === 'patient') {
    messageData.sender_patient_id = senderId;
    messageData.receiver_clinician_id = receiverId;
  } else {
    throw new Error('Invalid sender type');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([messageData]);

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  } else {
    console.log('Message sent:', data);
    return data;
  }
}
