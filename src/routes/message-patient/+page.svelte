<script>
  import { onMount } from 'svelte';
  import { sendMessage } from '../../functions/sendMessage';
  import { fetchMessages } from '../../functions/fetchMessages';
  import { supabase } from '../../supabaseClient';

  export let receiverId = '';
  export let senderId = '';

  let content = '';
  let messages = [];
  let currentUser = null;

  onMount(async () => {
    try {
      console.log('Fetching session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session fetched:', session);

      if (session && session.user) {
        currentUser = session.user;
        console.log('Current user:', currentUser);

        // Check if receiverId and senderId are provided via URL parameters
        const params = new URLSearchParams(window.location.search);
        receiverId = params.get('receiverId') || receiverId;
        senderId = params.get('senderId') || currentUser.id; // Ensure senderId is the current user ID
        console.log('Fetched receiverId from URL or prop:', receiverId);
        console.log('Fetched senderId from URL or prop:', senderId);

        console.log('Fetching messages...');
        messages = await fetchMessages(senderId, receiverId);
        console.log('Fetched messages:', messages);
      } else {
        console.error('No user session found.');
      }
    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
    }
  });

  async function handleSend() {
    try {
      if (content.trim() !== '') {
        const senderType = 'clinician'; // Since it's always the clinician sending messages in this component
        console.log('Sending message with the following details:');
        console.log('Sender ID:', senderId);
        console.log('Receiver ID:', receiverId);
        console.log('Content:', content);
        console.log('Sender Type:', senderType);

        await sendMessage(senderId, receiverId, content, senderType);
        console.log('Message sent. Fetching updated messages...');

        messages = await fetchMessages(senderId, receiverId);
        console.log('Fetched updated messages:', messages);

        content = ''; 
      } else {
        console.warn('Content is empty. Message not sent.');
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
