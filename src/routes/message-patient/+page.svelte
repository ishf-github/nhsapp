<script>
  import { onMount } from 'svelte';
  import { sendMessage } from '../../functions/sendMessage';
  import { fetchMessages } from '../../functions/fetchMessages';
  import { supabase } from '../../supabaseClient';

  export let receiverId = '';

  let content = '';
  let messages = [];
  let currentUser = null;

  onMount(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;

        // Check if receiverId is provided via URL parameters
        const params = new URLSearchParams(window.location.search);
        receiverId = params.get('receiverId') || receiverId;
        console.log('Fetched receiverId:', receiverId);

        messages = await fetchMessages(currentUser.id, receiverId);
      }
    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
    }
  });

  async function handleSend() {
    try {
      if (content.trim() !== '') {
        const senderType = 'clinician'; // Since it's always the clinician sending messages in this component
        console.log('Sending message:');
        console.log('Sender ID:', currentUser.id);
        console.log('Receiver ID:', receiverId);
        await sendMessage(currentUser.id, receiverId, content, senderType);
        messages = await fetchMessages(currentUser.id, receiverId);
        content = ''; 
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err);
    }
  }
</script>

<style>
  .message-list {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 1rem;
  }
  .sent {
    text-align: right;
    background-color: #005EB8;
    color: white;
    padding: 5px;
    margin: 5px 0;
    border-radius: 5px;
  }
  .received {
    text-align: left;
    background-color: #f0f0f0;
    padding: 5px;
    margin: 5px 0;
    border-radius: 5px;
  }
  textarea {
    width: 100%;
    height: 50px;
    padding: 10px;
    margin-bottom: 10px;
  }
  button {
    padding: 10px;
    background-color: #005EB8;
    color: white;
    border: none;
    cursor: pointer;
    width: 100%;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 600px;
  }
</style>

<div class="overlay">
  <div class="modal">
    <div class="message-list">
      {#each messages as message}
        <div class="{(message.sender_clinician_id || message.sender_patient_id) === currentUser.id ? 'sent' : 'received'}">
          <p>{message.content}</p>
          <small>{new Date(message.timestamp).toLocaleString()}</small>
        </div>
      {/each}
    </div>

    <textarea bind:value={content} placeholder="Type your message here..."></textarea>
    <button on:click={handleSend}>Send Message</button>
  </div>
</div>
