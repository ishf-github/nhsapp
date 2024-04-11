<script>
    import { writable } from 'svelte/store';
  
    // Stores to hold the appointment date and time
    let nameSurname = '';
    let selectedDate = writable(null);
    let selectedTime = '12:00 PM'; // Default time format, can be adjusted
  
    // Function to save the appointment
    function saveToCalendar() {
      // Combine the date and time into a single object
      // You would replace this with your actual logic to save the appointment
      const appointment = {
        nameSurname,
        date: $selectedDate,
        time: selectedTime,
      };
      
      console.log('Appointment to save:', appointment);
      // Add saving logic here
    }
  
    // This function will parse and format the date to a readable format
    function formatDate(date) {
      if (!date) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
    }
  </script>
  
  <div class="booking-container">
    <div>
      <input 
        type="text" 
        placeholder="Name Surname" 
        bind:value={nameSurname} 
      />
    </div>
  
    <div>
      <label for="date">SELECT DATE:</label>
      <input 
        type="date" 
        bind:value={$selectedDate}
        on:change={() => selectedDate.set($selectedDate)}
      />
      <p>{formatDate($selectedDate)}</p>
    </div>
  
    <div>
      <label for="time">SELECT TIME:</label>
      <input 
        type="time" 
        bind:value={selectedTime}
      />
    </div>
  
    <div>
      <button on:click={saveToCalendar}>SAVE TO CALENDAR</button>
    </div>
  </div>
  
  <style>
    /* Add your styles here */
    .booking-container {
      display: flex;
      flex-direction: column;
    }
  
    input, button {
      margin: 0.5em 0;
      padding: 0.5em;
    }
  
    button {
      background-color: #4CAF50; /* Green */
      color: white;
      padding: 14px 20px;
      margin: 8px 0;
      border: none;
      cursor: pointer;
    }
  
    button:hover {
      opacity: 0.8;
    }
  </style>
  