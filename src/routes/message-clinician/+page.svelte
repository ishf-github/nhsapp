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
  let recipientName = '';

  async function fetchRecipientName() {
    const { data, error } = await supabase
      .from('clinicians')
      .select('first_name, last_name')
      .eq('clinician_id', receiverId)
      .single();

    if (error) {
      console.error('Error fetching recipient name:', error);
      return 'Unknown Clinician';
    } else {
      return `${data.first_name} ${data.last_name}`;
    }
  }

  onMount(async () => {
    try {
      console.log('Fetching session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session fetched:', session);

      if (session && session.user) {
        currentUser = session.user;
        console.log('Current user:', currentUser);

        
        const params = new URLSearchParams(window.location.search);
        receiverId = params.get('receiverId') || receiverId;
        senderId = params.get('senderId') || currentUser.id;
        console.log('Fetched receiverId from URL or prop:', receiverId);
        console.log('Fetched senderId from URL or prop:', senderId);

        recipientName = await fetchRecipientName();
        console.log('Fetched recipient name:', recipientName);

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
        const senderType = 'patient';
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
    font-family: Arial, sans-serif;
  }
  .message {
    display: flex;
    flex-direction: column;
    max-width: 40%;
    margin: 5px 0;
    border-radius: 5px;
    padding: 5px;
    word-wrap: break-word;
  }
  .sent {
    align-self: flex-end;
    background-color: #005EB8;
    color: white;
    text-align: right;
    margin-left: auto;
  }
  .received {
    align-self: flex-start;
    background-color: #f0f0f0;
    color: black;
    text-align: left;
    margin-right: auto;
  }
  .message p {
    margin: 0;
  }
  .timestamp {
    font-size: 0.75em;
    color: #ccc;
    margin-top: 5px;
    text-align: right;
  }
  .recipient-name {
    font-family: 'Frutiger', sans-serif;
    font-weight: Bold;
    font-size: 1.5em;
    margin-bottom: 1rem;
    text-align: center;
  }
  textarea {
    width: calc(100% - 22px);
    height: 50px;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    display: inline-block;
    font-family: Arial, sans-serif;
    resize: none;
  }
  button {
    padding: 10px;
    background-color: #005EB8;
    color: white;
    border: none;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
    display: inline-block;
    border-radius: 5px;
    font-family: 'Frutiger', sans-serif;
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
    width: 90%;
    max-width: 600px;
    height: 90%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  @media (min-width: 768px) {
    .message-list {
      max-height: calc(80vh - 100px);
    }
    textarea {
      height: 60px;
    }
  }
  @media (max-width: 768px) {
    .message-list {
      max-height: calc(80vh - 90px);
    }
  }
</style>

<div class="overlay">
  <div class="modal">
    <div class="recipient-name">{recipientName}</div>
    <div class="message-list">
      {#each messages as message}
        <div class="message {(message.sender_clinician_id || message.sender_patient_id) === currentUser.id ? 'sent' : 'received'}">
          <p>{message.content}</p>
          <small class="timestamp">{new Date(message.timestamp).toLocaleString()}</small>
        </div>
      {/each}
    </div>
    <textarea bind:value={content} placeholder="Type your message here..."></textarea>
    <button on:click={handleSend}>Send Message</button>
  </div>
</div>
