<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';

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
        // Filter to only show the most recent message per sender-receiver pair
        const messageMap = new Map();
        data.forEach(message => {
          const key = message.sender_clinician_id || message.sender_patient_id + '-' + message.receiver_clinician_id || message.receiver_patient_id;
          if (!messageMap.has(key)) {
            messageMap.set(key, message);
          }
        });
        messages = Array.from(messageMap.values());
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
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc; 
  }
  
  .send-message-button {
    padding: 6px 12px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    cursor: pointer;
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
    font-size: 12px;
    background-color: #fff; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .inbox-empty {
    text-align: center;
    margin-top: 50px;
    font-size: 18px;
    color: #888;
  }
</style>

<div class="app-container">
  {#if inboxEmpty}
    <div class="inbox-empty">Inbox is empty</div>
  {:else}
    <div class="message-list">
      {#each messages as message (message.id)}
        <div class="message-container">
          <div>
            <div>{message.sender_clinician_id === currentUser.id || message.sender_patient_id === currentUser.id ? 'You' : (message.sender_clinician_id || message.sender_patient_id)}</div>
            <div class="message-preview">{message.content}</div>
          </div>
          <button class="send-message-button" on:click={() => openMessageWindow(message)}>SEND MESSAGE</button>
        </div>
      {/each}
    </div>
  {/if}

  <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>
</div>
