<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  import { writable } from 'svelte/store';

  const messages = writable([]);
  let currentUserId = null;

  async function fetchClinicianName(clinician_id) {
    // Query supabase for clinician details
    const { data, error } = await supabase
      .from('clinicians')
      .select('first_name, last_name')
      .eq('clinician_id', clinician_id)
      .single();

    if (error) {
      console.error('Error fetching clinician details:', error);
      return 'Unknown Clinician';
    }

    return `${data.first_name} ${data.last_name}`;
  }

  // Fetch patient messages
  async function fetchMessages() {
    // Patient session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      console.error('Error fetching user session:', sessionError);
      return;
    }

    currentUserId = sessionData.session.user.id;

    // Query supabase for messages received
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('sender_clinician_id, content, timestamp')
      .eq('receiver_patient_id', currentUserId)
      .order('timestamp', { ascending: false });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
    } else {
      // Latest message map
      const messageMap = new Map();

      for (const message of messagesData) {
        const key = message.sender_clinician_id;
        if (!messageMap.has(key)) {
          messageMap.set(key, message);
        }
      }

      // Messages with clinician array
      const fetchedMessages = [];
      for (const [clinician_id, message] of messageMap) {
        const clinicianName = await fetchClinicianName(clinician_id);
        fetchedMessages.push({
          clinician_id: clinician_id,
          clinician_name: clinicianName,
          last_message: message.content,
          timestamp: message.timestamp,
        });
      }

      // Update messages
      messages.set(fetchedMessages);
    }
  }

  // Open clinician conversation
  function openConversation(clinician_id) {
    const url = `/message-clinician?receiverId=${clinician_id}&senderId=${currentUserId}`;
    const windowFeatures = "width=800,height=600,noopener,noreferrer";
    window.open(url, "_blank", windowFeatures);
  }

  // Call fetchMessages on mount
  onMount(fetchMessages);
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    font-family: 'Frutiger', sans-serif;
  }

  .header {
    font-weight: bold;
    background-color: #005EB8;
    color: white;
    padding: 1rem;
    text-align: center;
    border-radius: 4px;
  }

  .message-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .message-info {
    display: flex;
    flex-direction: column;
    margin-right: 1rem;
  }

  .clinician-name {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .last-message {
    color: #555;
    margin-bottom: 0.5rem;
  }

  .timestamp {
    font-size: 0.8rem;
    color: #999;
  }

  .send-message-button {
    background-color: #005EB8;
    color: white;
    padding: 0.75rem 1rem;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    font-family: 'Frutiger', sans-serif;
    text-transform: capitalize;
    font-size: 1rem;
  }

  .send-message-button:hover {
    background-color: #004080;
  }

  .no-messages {
    text-align: center;
    color: #999;
  }
</style>

<div class="container">
  <div class="header">My Messages</div>
  {#if $messages.length === 0}
    <p class="no-messages">No messages found.</p>
  {:else}
    {#each $messages as message}
      <div class="message-item">
        <div class="message-info">
          <div class="clinician-name">{message.clinician_name}</div>
          <div class="last-message">{message.last_message}</div>
          <div class="timestamp">{new Date(message.timestamp).toLocaleString()}</div>
        </div>
        <button class="send-message-button" on:click={() => openConversation(message.clinician_id)}>Send Message</button>
      </div>
    {/each}
  {/if}
</div>
