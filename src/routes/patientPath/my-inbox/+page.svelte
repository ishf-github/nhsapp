<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  import { goto } from '$app/navigation';

  type Message = {
    clinician_name: string;
    sender: string;
    last_message: string;
  };

  let messages: Message[] = [];

  onMount(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('clinician_name, sender, last_message');

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      messages = data as Message[];
    }
  });

  function openConversation(clinicianName: string) {
    // Navigate to the conversation page
    // You might want to pass the clinician's name or id as a parameter
    goto(`/conversation/${clinicianName}`);
  }
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
    margin-bottom: 1rem;
    padding: 1rem;
    text-align: center;
  }

  .message-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f0;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
  }

  .message-info {
    display: flex;
    flex-direction: column;
  }

  .clinician-name {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .last-message {
    color: #555;
  }

  .send-message-button {
    background-color: #ccc;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
</style>

<div class="container">
  <div class="header">My Messages</div>
  {#each messages as message}
    <div class="message-item">
      <div class="message-info">
        <div class="clinician-name">{message.clinician_name}</div>
        <div class="last-message">{message.sender}: {message.last_message.substring(0, 25)}...</div>
      </div>
      <button class="send-message-button" on:click={() => openConversation(message.clinician_name)}>SEND MESSAGE</button>
    </div>
  {/each}
</div>
