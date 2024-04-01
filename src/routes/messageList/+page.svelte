<script>
    import { goto } from '$app/navigation';
    
    // Placeholder for the message search query
    let searchQuery = '';
  
    // Placeholder messages data
    const messages = [
      { name: 'NAME SURNAME', preview: 'Just to check, do you have...', id: 1 },
      // Add more message objects as needed
    ];
  
    // Function to handle the navigation to the send message page
    function sendMessage(id) {
      // Implementation to navigate to the send message page for a given user
      console.log('Send message to user with id:', id);
    }
  
    function navigateTo(page) {
      goto(`/${page}`);
    }
  </script>
  
  <style>
    /* Styles for your components */
    .search-container {
      /* Styles for the search bar container */
    }
    
    .message-container {
      /* Styles for the message container */
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #ccc; /* Example style */
    }
    
    .message-preview {
      /* Styles for the message preview */
    }
    
    .send-message-button {
      /* Styles for the send message CTA button */
    }
    
    .message-list {
      /* Styles for the scrolling message list */
      overflow-y: auto;
      max-height: 300px; /* Adjust as needed */
    }
    
    .icon-round {
    position: fixed;
    bottom: 64px; /* Distance from bottom, adjust as needed */
    right: 20px; /* Distance from right, adjust as needed */
    z-index: 30; /* Higher than nav's z-index to ensure visibility */
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    background-color: #fff; /* Or any desired background color */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }


  </style>
  
  <div class="app-container">
    
    <div class="message-list">
      {#each messages as message (message.id)}
        <div class="message-container">
          <div>
            <div>{message.name}</div>
            <div class="message-preview">{message.preview}</div>
          </div>
          <button class="send-message-button" on:click={() => sendMessage(message.id)}>SEND MESSAGE</button>
        </div>
      {/each}
    </div>
  
    <!-- Round notes CTA button, identical to the one on the home page -->
    <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>
  
  
    
  </div>
  