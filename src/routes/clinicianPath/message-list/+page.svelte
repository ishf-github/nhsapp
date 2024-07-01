<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  import { goto } from '$app/navigation';

  let searchQuery = '';
  let messages = [];
  let currentUser = null;
  let inboxEmpty = false;

  async function fetchMessages() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error.message);
        return;
      }

      currentUser = session?.user;
      if (!currentUser) {
        console.error('User not authenticated');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_clinician_id.eq.${currentUser.id},receiver_clinician_id.eq.${currentUser.id},sender_patient_id.eq.${currentUser.id},receiver_patient_id.eq.${currentUser.id}`)
        .order('timestamp', { ascending: false });

      if (fetchError) {
        console.error('Error fetching messages:', fetchError.message, fetchError.details);
      } else if (data.length === 0) {
        inboxEmpty = true;
      } else {
        const messageMap = new Map();
        for (const message of data) {
          const senderId = message.sender_clinician_id || message.sender_patient_id;
          const receiverId = message.receiver_clinician_id || message.receiver_patient_id;
          const key = senderId < receiverId ? `${senderId}-${receiverId}` : `${receiverId}-${senderId}`;
          if (!messageMap.has(key)) {
            messageMap.set(key, message);
          }
        }

        messages = await Promise.all(Array.from(messageMap.values()).map(async message => {
          const otherUserId = message.sender_clinician_id === currentUser.id || message.sender_patient_id === currentUser.id
            ? (message.receiver_clinician_id || message.receiver_patient_id)
            : (message.sender_clinician_id || message.sender_patient_id);

          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .select('first_name, last_name')
            .eq('patient_id', otherUserId)
            .single();

          if (patientError) {
            console.error('Error fetching patient info:', patientError.message, patientError.details);
            return { ...message, patientName: 'Unknown' };
          }

          return {
            ...message,
            patientName: `${patientData.first_name} ${patientData.last_name}`
          };
        }));

        inboxEmpty = false;
      }
    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
    }
  }

  function openMessageWindow(message) {
    let receiverId;
    if (message.sender_clinician_id === currentUser.id || message.sender_patient_id === currentUser.id) {
      receiverId = message.receiver_clinician_id || message.receiver_patient_id;
    } else {
      receiverId = message.sender_clinician_id || message.sender_patient_id;
    }
    console.log('Opening message window with receiverId:', receiverId);
    const url = `/message-patient?receiverId=${receiverId}`;
    window.open(url, '_blank', 'width=600,height=400');
  }

  function navigateTo(page) {
    if (page === 'notes') {
      goto('../notes');
    } else if (page === 'new-message') {
      goto('/new-message');
    }
  }

  onMount(() => {
    fetchMessages();
  });
</script>

<style>
  .app-container {
    padding: 20px;
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

  .send-message-button, .new-message-button {
    padding: 12px 18px;
    font-family: 'Frutiger', sans-serif;
    font-weight: normal;
    font-size: 16px;
    background-color: #005EB8;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    text-transform: capitalize;
    margin-top: 8px;
  }

  .message-list {
    overflow-y: auto;
    max-height: 300px;
  }

  .icon-round {
    position: fixed;
    bottom: 64px;
    right: 20px;
    z-index: 30;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    background-color: #005EB8;
    color: white;
    font-family: 'Frutiger', sans-serif;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
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
  <!-- <button class="new-message-button" on:click={() => navigateTo('new-message')}>New Message</button> -->

  {#if inboxEmpty}
    <div class="inbox-empty">Inbox is empty</div>
  {:else}
    <div class="message-list">
      {#each messages as message (message.message_id)}
        <div class="message-container">
          <div>
            <div class="patient-name"><strong>{message.patientName}</strong></div>
            <div style="font-family: Arial, sans-serif;">{message.sender_clinician_id === currentUser.id || message.sender_patient_id === currentUser.id ? 'You' : (message.sender_clinician_id || message.sender_patient_id)}</div>
            <div class="message-preview" style="font-family: Arial, sans-serif;">{message.content}</div>
          </div>
          <button class="send-message-button" on:click={() => openMessageWindow(message)}>Send Message</button>
        </div>
      {/each}
    </div>
  {/if}

  <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>Notes</button>
</div>
