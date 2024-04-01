<script>
    import Button from "../../components/Button.svelte";
    import { goto } from '$app/navigation';

    const handleClick = () => {
      alert("Button clicked");
  };

  function navigateTo(page) {
  if (page === 'patients') {
    goto('/patients');
  } else if (page === 'notes') {
    goto('/notes'); // Ensure this is the correct route
  }
  // Add more cases as needed
}

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
  
    function sendMessage() {
      if (newMessageContent.trim() === '') return;
  
      const newMessage = {
        content: newMessageContent,
        sender: 'provider',
        timestamp: new Date().toLocaleTimeString()
      };
  
      messages = [...messages, newMessage];
      newMessageContent = '';
    }
  
    function viewPatientRecord() {
      // Navigate to the patient record
      goto('/patientRecord'); // Update this to your actual route
    }
  
    function viewNotes() {
      // Navigate to the notes page
      goto('/notes'); // Update this to your actual route
    }
  </script>
  
  <style>
    .patient-summary {
      padding: 16px;
      background-color: #f8f8f8;
      border-bottom: 1px solid #ddd;
      text-align: center;
    }
  
    .messages {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      max-height: 300px; 
      margin-top: 16px;
      margin-bottom: 0px;
    }
  
    .message {
      max-width: 80%;
      margin: 8px;
      padding: 8px;
      background-color: #ececec;
      border-radius: 4px;
    }
  
    .message.provider {
      align-self: flex-end;
      background-color: #d1d1d1;
    }
  
    .message.patient {
      align-self: flex-start;
    }
  
    .message-input {
    position: fixed;
    bottom: 70px; /* Adjust this value to the height of your nav bar */
    left: 0;
    right: 0;
    padding: 8px;
    background: white;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10; /* Make sure this is less than the z-index of your nav bar so it doesn't overlap */
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .message-input textarea {
    flex-grow: 1;
    margin-right: 8px; /* Spacing between textarea and buttons */
  }

  .message-input button {
    width: 48x; /* Making the button square */
    height: 48px; /* Making the button square */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px; /* Adjust size for the paperclip icon if necessary */
    background-color: #f0f0f0; /* Your button background color */
    border: none;
    cursor: pointer;
  }

    .patient-messages-page {
      margin-bottom: 70px; /* Adjusted for fixed nav bar height */
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

  .attach-button {
    font-family: 'Font Awesome 5 Free'; /* Using Font Awesome for the paperclip icon */
    font-weight: 900; /* Font Awesome specific font-weight for solid icons */
  }

  </style>
  
  <div class="patient-messages-page">
    <div class="patient-summary">
      <h2>{patientSummary.name}</h2>
      <p>Dob: {patientSummary.dob}</p>
      <p>Next Appt: {patientSummary.nextAppt}</p>
      <button on:click={viewPatientRecord}>VIEW RECORD</button>
    </div>
  
    <!-- Messages display -->
    <div class="messages">
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
        <button class="attach-button" on:click={attachFile}>
          &#x1F4CE; <!-- This is the Unicode for paperclip, you can replace it with an icon from a library like Font Awesome -->
        </button>
        <button on:click={sendMessage}>SEND</button>
      </div>
  
    <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>
  </div>
  
  