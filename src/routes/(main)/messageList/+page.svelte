<script>
    import { goto } from '$app/navigation';
    
    
    let searchQuery = '';
  
    
    const messages = [
      { name: 'NAME SURNAME', preview: 'Just to check, do you have...', id: 1 },
      
    ];
  
    
    function sendMessage(id) {
      
      console.log('Send message to user with id:', id);
    }
  
    function navigateTo(page) {
        if (button === 'Send Message') {
        goto('/patientMessages'); 
      }
    }
    
  </script>
  
  <style>
    
    /* .search-container {
      
    } */
    
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


  </style>
  
  <div class="app-container">
    
    <div class="message-list">
      {#each messages as message (message.id)}
        <div class="message-container">
          <div>
            <div>{message.name}</div>
            <div class="message-preview">{message.preview}</div>
          </div>
          <button class="send-message-button" on:click={() => navigateTo('patientMessages')}>SEND MESSAGE</button>
        </div>
      {/each}
    </div>

    
    <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>
  
  
    
  </div>
  