<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  import { writable } from 'svelte/store';
  import { v4 as uuidv4 } from 'uuid'; // Import UUID library
  import { goto } from '$app/navigation'; // Import goto for navigation

  let selectedDate;
  let selectedTime;
  const showModal = writable(false);
  let clinicians = [];
  let selectedClinician = '';
  let reasonForAppointment = '';
  let minDate;
  let timeSlots = [];
  let currentUser = null;
  let patientName = '';

  onMount(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;
      }

      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('first_name, last_name')
        .eq('patient_id', currentUser.id)
        .single();

      if (patientError) {
        console.error('Error fetching patient data:', patientError.message, patientError.hint, patientError.details);
      } else {
        patientName = `${patientData.first_name} ${patientData.last_name}`;
      }

      const { data, error } = await supabase
        .from('clinicians')
        .select('clinician_id, first_name, last_name')
        .eq('department', 'General Practitioner Services');

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

    minDate = getMinDate();
  });

  function getMinDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function generateTimeSlots() {
    const slots = [];
    const now = new Date();
    const start = new Date(selectedDate);
    start.setHours(8, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(18, 0, 0, 0);

    while (start <= end) {
      if (selectedDate === getMinDate() && start <= now) {
        start.setMinutes(start.getMinutes() + 15);
        continue;
      }
      slots.push(start.toTimeString().substring(0, 5));
      start.setMinutes(start.getMinutes() + 15);
    }

    return slots;
  }

  $: if (selectedDate) {
    timeSlots = generateTimeSlots();
  }

  async function saveAppointment() {
    const clinician = clinicians.find(clin => `${clin.first_name} ${clin.last_name}` === selectedClinician);

    if (!clinician) {
      console.error('Clinician not found');
      return;
    }

    const newAppointment = {
      appointment_id: uuidv4(),
      clinician_name: `${clinician.first_name} ${clinician.last_name}`,
      clinician_id: clinician.clinician_id,
      patient_id: currentUser.id,
      patient_name: patientName,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      appointment_type: 'Video Call',
      notes: reasonForAppointment,
      status: 'BOOKED'
    };

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([newAppointment]);

      if (error) {
        console.error('Error saving appointment:', error.message, error.hint, error.details);
      } else {
        console.log('Appointment saved:', newAppointment);
        alert('Appointment Booked');
        goto('/patientPath/my-appointments');
      }
    } catch (err) {
      console.error('Error inserting data:', err.message);
    }
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

  .dropdown-container,
  .date-input,
  .time-input,
  .reason-input {
    margin-bottom: 1rem;
  }

  .dropdown,
  .input-field,
  .textarea-field {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .button {
    font-family: 'Frutiger', sans-serif;
    font-weight: normal;
    background-color: #005EB8;
    color: white;
    border: none;
    cursor: pointer;
    padding: 1rem;
    border-radius: 4px;
    text-align: center;
    text-transform: capitalize;
    margin-top: 8px;
  }

  .label {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
</style>

<div class="container">
  <div class="dropdown-container">
    <label class="label" for="clinician">Search for a Clinician:</label>
    <select class="dropdown" id="clinician" bind:value={selectedClinician}>
      <option value="" disabled selected>Select a Clinician</option>
      {#each clinicians as clinician}
        <option value="{clinician.first_name} {clinician.last_name}">
          {clinician.first_name} {clinician.last_name}
        </option>
      {/each}
    </select>
  </div>

  <div class="date-input">
    <label class="label" for="date">Select Date:</label>
    <input class="input-field" type="date" id="date" bind:value={selectedDate} min={minDate}>
  </div>

  <div class="time-input">
    <label class="label" for="time">Select Time:</label>
    <select class="input-field" bind:value={selectedTime}>
      <option value="">Select a time</option>
      {#each timeSlots as slot}
        <option value={slot}>{slot}</option>
      {/each}
    </select>
  </div>

  <div class="reason-input">
    <label class="label" for="reason">Reason for appointment:</label>
    <textarea class="textarea-field" id="reason" bind:value={reasonForAppointment}></textarea>
  </div>

  <button class="button" on:click={saveAppointment}>Book Video Call Appointment</button>
</div>
