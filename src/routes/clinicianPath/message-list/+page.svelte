<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  import { goto } from '$app/navigation';

  // State variables
  let searchQuery = '';
  let messages = [];
  let currentUser = null;
  let inboxEmpty = false;

  // Fetch message
  async function fetchMessages() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        return;
      }

      currentUser = session?.user;
      if (!currentUser) {
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_clinician_id.eq.${currentUser.id},receiver_clinician_id.eq.${currentUser.id},sender_patient_id.eq.${currentUser.id},receiver_patient_id.eq.${currentUser.id}`)
        .order('timestamp', { ascending: false });

      if (fetchError) {
        return;
      } else if (data.length === 0) {
        inboxEmpty = true;
      } else {
        const patientIds = new Set();
        const uniqueMessages = new Map();

        for (const message of data) {
          const senderId = message.sender_clinician_id || message.sender_patient_id;
          const receiverId = message.receiver_clinician_id || message.receiver_patient_id;
          const otherUserId = senderId === currentUser.id ? receiverId : senderId;

          if (!uniqueMessages.has(otherUserId)) {
            uniqueMessages.set(otherUserId, message);
            if (message.sender_patient_id && message.sender_patient_id !== currentUser.id) {
              patientIds.add(message.sender_patient_id);
            }
            if (message.receiver_patient_id && message.receiver_patient_id !== currentUser.id) {
              patientIds.add(message.receiver_patient_id);
            }
          }
        }

        const { data: patientsData, error: patientsError } = await supabase
          .from('patients')
          .select('patient_id, first_name, last_name')
          .in('patient_id', Array.from(patientIds));

        if (patientsError) {
          return;
        } else {
          const patientMap = new Map();
          for (const patient of patientsData) {
            patientMap.set(patient.patient_id, `${patient.first_name} ${patient.last_name}`);
          }

          messages = Array.from(uniqueMessages.values()).map(message => ({
            ...message,
            patientName: message.sender_patient_id
              ? patientMap.get(message.sender_patient_id) || 'Unknown'
              : patientMap.get(message.receiver_patient_id) || 'Unknown'
          }));

          inboxEmpty = false;
        }
      }
    } catch (err) {
    }
  }

  // Open messages
  function openMessageWindow(message) {
    let receiverId;
    if (message.sender_clinician_id === currentUser.id || message.sender_patient_id === currentUser.id) {
      receiverId = message.receiver_clinician_id || message.receiver_patient_id;
    } else {
      receiverId = message.sender_clinician_id || message.sender_patient_id;
    }
    const url = `/message-patient?receiverId=${receiverId}`;
    window.open(url, '_blank', 'width=600,height=400');
  }

  // Navigation
  function navigateTo(page) {
    if (page === 'notes') {
      goto('../notes');
    } else if (page === 'new-message') {
      goto('/new-message');
    }
  }

  // Fetch messages on component mount
  onMount(() => {
    fetchMessages();
  });
</script>

<style>
  .app-container {
    padding: 20px;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .message-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    line-height: 1.6;
  }

  .send-message-button {
    padding: 0px 12px;
    font-family: 'Frutiger', sans-serif;
    font-weight: normal;
    background-color: #005EB8;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    text-align: center;
    text-transform: capitalize;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .message-list {
    overflow-y: auto;
    flex-grow: 1;
  }

  .inbox-empty {
    text-align: center;
    margin-top: 50px;
    font-size: 18px;
    color: #888;
  }

  .patient-name {
    font-size: 1.5rem;
    font-family: 'Frutiger', sans-serif;
  }
</style>

<div class="app-container">
  {#if inboxEmpty}
    <div class="inbox-empty">Inbox is empty</div>
  {:else}
    <div class="message-list">
      {#each messages as message (message.message_id)}
        <div class="message-container">
          <div>
            <div class="patient-name"><strong>{message.patientName}</strong></div>
            <div style="font-family: Arial, sans-serif;">{message.sender_clinician_id === currentUser.id || message.sender_patient_id === currentUser.id ? 'You' : message.patientName}</div>
            <div class="message-preview" style="font-family: Arial, sans-serif;">{message.content}</div>
          </div>
          <button class="send-message-button" on:click={() => openMessageWindow(message)}>Send Message</button>
        </div>
      {/each}
    </div>
  {/if}
</div>
