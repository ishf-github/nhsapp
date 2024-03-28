<script>
    import { goto } from '$app/navigation';

    let patientSummary = {
      name: 'NAME SURNAME',
      dob: '01/01/1991',
      nextAppt: '01/01/2025'
    };
  
    let messages = [
      { content: 'Hello there!', sender: 'patient', timestamp: 'Yesterday' },
      { content: 'How can I help you today?', sender: 'provider', timestamp: 'Today' },
      // More messages...
    ];

    let newMessageContent = '';
    let messageList = null; // Initialize messageList as null

    function sendMessage() {
        if (newMessageContent.trim() === '') return;

        const newMessage = {
            content: newMessageContent,
            sender: 'provider',
            timestamp: new Date().toLocaleTimeString() // Real timestamp
        };
    
        messages = [...messages, newMessage];
        newMessageContent = '';

        if (messageList) {
            messageList.scrollTo(0, messageList.scrollHeight); // Scroll to bottom
        }
    }
  


    function viewPatientRecord() {
      // Navigate to the patient record
    }
  
    function searchMessages() {
      // Implement search logic
    }
  
    function attachFile() {
      // Implement file attachment logic
    }
  
    function viewNotes() {
      // Navigate to the notes page
    }
  </script>
  
  <style>
    /* Your CSS styles here */
  
    /* For example: */
    .patient-summary {
      /* Styles for the patient summary section */
    }
  
    .search-bar {
      /* Styles for the search bar */
    }
  
    .messages {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 300px;
    padding-bottom: 100px; /* Add space for the message input */
    /* ... */
  }
  

    .message {
    max-width: 80%;
    margin: 8px;
    padding: 8px;
    /* Add more styles for message */
  }
  
  .message.provider {
    align-self: flex-end;
    background-color: #ececec; /* Different background for sent messages */
  }

  .message.patient {
    align-self: flex-start;
    background-color: #d1d1d1; /* Different background for received messages */
  }

  .message-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 8px;
    z-index: 2; /* Ensure it's above other content */
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1); /* Optional: adds a shadow to the top of the message input for better separation */
  }
  
  .patient-messages-page {
    padding-bottom: 70px; /* Height of your message input box + some extra space */
  }

    .round-button {
      /* Styles for round button */
    }
  
    .attach-button {
      /* Styles for attach file button */
    }

    /* You'll need to flesh out these styles to match the design */
  </style>
  
  <div class="patient-messages-page">
    <div class="patient-summary">
      <h2>{patientSummary.name}</h2>
      <p>Dob: {patientSummary.dob}</p>
      <p>Next Appt: {patientSummary.nextAppt}</p>
      <button on:click={viewPatientRecord}>VIEW RECORD</button>
    </div>
    
    <input class="search-bar" type="text" placeholder="SEARCH MESSAGES..." on:input={searchMessages}>
  
     <!-- Messages display -->
     <div class="messages" bind:this={messageList}>
        {#each messages as message (message.timestamp)}
          <div class="message {message.sender}">
            {message.content}
            <span>{message.timestamp}</span>
          </div>
        {/each}
      </div>
  


    <!-- Message input -->
  <div class="message-input">
    <textarea bind:value={newMessageContent} placeholder="Type your message here..."></textarea>
    <button on:click={sendMessage}>SEND</button>
  </div>
  
    <button class="round-button" on:click={viewNotes}>NOTES</button>
  </div>
  
  <!-- You can add the footer with navigation buttons as per your design -->
  <footer>
    <!-- Navigation buttons here -->
  </footer>
  