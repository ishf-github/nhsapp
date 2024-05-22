<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '../../../supabaseClient';
    import { writable } from 'svelte/store';
  
    type Message = {
      sender: string;
      content: string;
    };
  
    let clinician = {
      name: 'Dr. Thompson',
      department: 'Allergy Clinic',
      practice: 'Westminster Hospital'
    };
  
    let messages: Message[] = [];
    let newMessage = '';
  
    onMount(async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('sender, content')
        .eq('conversation_id', 1); // Assuming you fetch messages by conversation_id
  
      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        messages = data as Message[];
      }
    });
  
    const handleSend = async () => {
      if (newMessage.trim()) {
        const message = {
          sender: 'You',
          content: newMessage
        };
  
        const { error } = await supabase
          .from('messages')
          .insert([{ conversation_id: 1, sender: message.sender, content: message.content }]); // Assuming conversation_id is 1
  
        if (error) {
          console.error('Error sending message:', error);
        } else {
          messages = [...messages, message];
          newMessage = '';
        }
      }
    };
  </script>
  
  <style>
    .container {
      display: flex;
      flex-direction: column;
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }
  
    .header {
      font-family: 'Frutiger', sans-serif;
      font-weight: bold;
      background-color: #005EB8;
      color: white;
      padding: 1rem;
      text-align: left;
    }
  
    .header p {
      margin: 0;
      font-weight: normal;
      font-size: 0.9rem;
    }
  
    .messages {
      flex-grow: 1;
      overflow-y: auto;
      margin-bottom: 1rem;
    }
  
    .message {
      margin: 0.5rem 0;
      padding: 0.75rem;
      border-radius: 12px;
      max-width: 70%;
    }
  
    .clinician-message {
      background-color: #f0f0f0;
      align-self: flex-start;
    }
  
    .patient-message {
      background-color: #005EB8;
      color: white;
      align-self: flex-end;
    }
  
    .input-container {
      display: flex;
      align-items: center;
      background-color: #f0f0f0;
      padding: 0.5rem;
      border-radius: 12px;
    }
  
    .input-container input {
      flex-grow: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 12px;
      margin-right: 0.5rem;
    }
  
    .input-container button {
      background-color: #ccc;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
  
    .paperclip {
      margin-right: 0.5rem;
      cursor: pointer;
    }
  </style>
  
  <div class="container">
    <div class="header">
      {clinician.name}
      <p>{clinician.department}, {clinician.practice}</p>
    </div>
  
    <div class="messages">
      {#each messages as message}
        <div class="message {message.sender === 'You' ? 'patient-message' : 'clinician-message'}">
          {message.content}
        </div>
      {/each}
    </div>
  
    <div class="input-container">
      <div class="paperclip">📎</div>
      <input type="text" bind:value={newMessage} placeholder="Type a message..." />
      <button on:click={handleSend}>Send</button>
    </div>
  </div>
  