'<script>
    import { onMount } from 'svelte';
  
    let patientName = 'NAME SURNAME';
    let patientDOB = 'DoB: 01/01/1991';
    let nextAppointment = 'Next Appt: 02/03/2024';
    let selectedDate;
    let selectedTime;
  
    onMount(() => {
      
    });
  
    function saveAppointment() {
      //save function
      console.log(`Appointment set for ${selectedDate} at ${selectedTime}`);
    }
  
    function viewRecord() {
      // patient record nav
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
  
    .patient-details {
      display: flex;
      justify-content: space-between;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 1rem;
      margin-bottom: 2rem;
      align-items: center;
    }
  
    .patient-info {
      text-align: left;
    }
  
    .button {
        background-color: #f0f0f0;
        border: 1px solid #ccc;
      color: black;
      padding: 6px 12px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 8px;
      cursor: pointer;
      border-radius: 4px;
    }
  
    .time-input, .date-input {
      text-align: left;
      margin: 1rem 0;
    }
  
    .save-button {
      margin-top: 2rem;
    }
  </style>
  
  <div class="container">
    <div class="patient-details">
      <div class="patient-info">
        <h2>{patientName}</h2>
        <p>{patientDOB}</p>
        <p>{nextAppointment}</p>
      </div>
      <button class="button" on:click={viewRecord}>View Record</button>
    </div>
  
    <div class="date-input">
      <label for="date">Select Date:</label>
      <input type="date" id="date" bind:value={selectedDate}>
    </div>
  
    <div class="time-input">
      <label for="time">Select Time:</label>
      <input type="time" id="time" bind:value={selectedTime}>
    </div>
  
    <button class="button save-button" on:click={saveAppointment}>Save to Calendar</button>
  </div>
  '