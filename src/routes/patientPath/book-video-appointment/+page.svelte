<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  import { writable } from 'svelte/store';
  import { v4 as uuidv4 } from 'uuid'; // Import UUID library

  let selectedDate;
  let selectedTime;
  const showModal = writable(false);
  let clinicians = [];
  let selectedClinician = '';
  let selectedClinicianId = null;

  const gpSurgeryName = 'GP Surgery Name';
  const gpAddress = 'Line 1, Line 2, City, County, Postcode';

  onMount(async () => {
    try {
      const { data, error } = await supabase
        .from('clinicians')
        .select('clinician_id, first_name, last_name');

      if (error) {
        console.error('Error fetching clinicians:', error.message, error.hint, error.details);
      } else if (data.length === 0) {
        console.warn('No clinicians found. Make sure the table is populated.');
      } else {
        clinicians = data;
        console.log('Fetched clinicians:', clinicians);
      }
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  });

  async function saveAppointment() {
    // Find the selected clinician
    const clinician = clinicians.find(clin => `${clin.first_name} ${clin.last_name}` === selectedClinician);

    if (!clinician) {
      console.error('Clinician not found');
      return;
    }

    selectedClinicianId = clinician.clinician_id;

    const newAppointment = {
      appointment_id: uuidv4(),
      clinician_name: `${clinician.first_name} ${clinician.last_name}`,
      clinician_id: selectedClinicianId,
      patient_name: null, // Replace with actual patient name if available
      patient_id: null, // Replace with actual patient ID if available
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      appointment_type: null,
      notes: null,
      status: null
    };

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([newAppointment]);

      if (error) {
        console.error('Error saving appointment:', error.message, error.hint, error.details);
      } else {
        console.log('Appointment saved:', newAppointment);
      }
    } catch (err) {
      console.error('Error inserting data:', err.message);
    }
  }

  function toggleModal() {
    showModal.update(n => !n);
  }
</script>

<style>
  .container {
    font-family: 'Frutiger', sans-serif;
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }

  .gp-info {
    margin-bottom: 1rem;
  }

  .gp-info p {
    margin: 0.25rem 0;
  }

  .dropdown-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .dropdown {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    width: 80%; 
    max-width: 600px; 
    height: auto; 
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .modal-bg {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .show {
    display: block;
  }

  .input-field {
    margin-bottom: 1rem;
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .button {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    color: black;
    padding: 1rem 2rem;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    width: 100%;
  }

  .button-secondary {
    background-color: #f0f0f0;
    color: black;
  }

  .date-input, .time-input {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  label {
    margin-bottom: 0.5rem;
  }

  input[type="date"],
  input[type="time"] {
    max-width: 100%;
    box-sizing: border-box;
  }
</style>

<div class="container">
  <div class="gp-info">
    <p>{gpSurgeryName}</p>
    <p>{gpAddress}</p>
  </div>

  <div class="dropdown-container">
    <select class="dropdown" bind:value={selectedClinician}>
      <option value="" disabled selected>Search for a Clinician</option>
      {#each clinicians as clinician}
        <option value="{clinician.first_name} {clinician.last_name}">
          {clinician.first_name} {clinician.last_name}
        </option>
      {/each}
    </select>
  </div>

  <div class="date-input">
    <label for="date">Select Date:</label>
    <input class="input-field" type="date" id="date" bind:value={selectedDate}>
  </div>

  <div class="time-input">
    <label for="time">Select Time:</label>
    <input class="input-field" type="time" id="time" bind:value={selectedTime}>
  </div>

  <button class="button" on:click={saveAppointment}>Book appointment</button>
</div>
