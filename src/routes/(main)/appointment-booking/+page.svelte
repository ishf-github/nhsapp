<script>
  import { onMount } from 'svelte';
  import { checkClinicianAuth } from '../../../utils/auth'; // Adjust the import path based on your project structure
  import { supabase } from '../../../supabaseClient';
  import { writable } from 'svelte/store';
  import { v4 as uuidv4 } from 'uuid';

  let selectedPatient = '';
  let patients = [];
  let selectedDate;
  let selectedTime;
  let clinician = {};

  const showModal = writable(false);

  onMount(async () => {
    clinician = await checkClinicianAuth();
    if (!clinician) return;

    try {
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('first_name, last_name, nhs_number, date_of_birth, user_id');

      if (patientsError) {
        console.error('Error fetching patients:', patientsError.message, patientsError.hint, patientsError.details);
      } else if (patientsData.length === 0) {
        console.warn('No patients found. Make sure the table is populated.');
      } else {
        patients = patientsData;
        console.log('Fetched patients:', patients);
      }
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  });

  async function saveAppointment() {
    const patient = patients.find(p => getPatientDetails(p) === selectedPatient);
    if (!patient) {
      console.error('Patient not found');
      return;
    }
    const appointment = {
      appointment_id: uuidv4(),
      clinician_name: `${clinician.first_name} ${clinician.last_name}`,
      clinician_id: clinician.clinician_id,
      patient_name: `${patient.first_name} ${patient.last_name}`,
      patient_id: patient.user_id,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      status: 'booked'
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment]);

    if (error) {
      console.error('Error saving appointment:', error.message, error.hint, error.details);
    } else {
      console.log('Appointment saved:', data);
    }
  }

  function viewRecord() {
    // Navigate to patient record
  }

  function getPatientDetails(patient) {
    return `${patient.first_name} ${patient.last_name} (NHS Number: ${patient.nhs_number})`;
  }

  function generateTimeOptions() {
    const times = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  }

  const timeOptions = generateTimeOptions();
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

  .dropdown-container {
    margin-bottom: 1rem;
  }

  .dropdown {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
</style>

<div class="container">
  <div class="dropdown-container">
    <select class="dropdown" bind:value={selectedPatient}>
      <option value="" disabled selected>Select a Patient</option>
      {#each patients as patient}
        <option value={getPatientDetails(patient)}>
          {getPatientDetails(patient)}
        </option>
      {/each}
    </select>
  </div>

  {#if selectedPatient}
    <div class="patient-details">
      <div class="patient-info">
        <h2>{selectedPatient}</h2>
      </div>
      <button class="button" on:click={viewRecord}>View Record</button>
    </div>

    <div class="date-input">
      <label for="date">Select Date:</label>
      <input type="date" id="date" bind:value={selectedDate}>
    </div>

    <div class="time-input">
      <label for="time">Select Time:</label>
      <select id="time" bind:value={selectedTime} class="dropdown">
        <option value="" disabled selected>Select Time</option>
        {#each timeOptions as time}
          <option value={time}>{time}</option>
        {/each}
      </select>
    </div>

    <button class="button save-button" on:click={saveAppointment}>Save to Calendar</button>
  {/if}
</div>
