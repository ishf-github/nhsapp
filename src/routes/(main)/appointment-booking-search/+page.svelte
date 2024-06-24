<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { supabase } from '../../../supabaseClient';
  
  let selectedDate;
  let selectedTime;
  let patientQuery = '';
  let patients = [];
  let selectedPatient = '';
  let selectedPatientName = '';
  let clinicianId = '';
  let clinicianName = '';
  const showModal = writable(false);
  let minDate;
  let timeSlots = [];
  
  async function searchPatients() {
    if (patientQuery.trim() !== '' && patientQuery !== selectedPatientName) {
      const { data, error } = await supabase
        .from('patients')
        .select('patient_id, first_name, last_name')
        .or(`first_name.ilike.%${patientQuery}%,last_name.ilike.%${patientQuery}%`);
  
      if (error) {
        console.error('Error searching patients:', error);
        patients = [];
      } else {
        patients = data;
      }
    } else {
      patients = [];
    }
  }
  
  function handlePatientSelection(event) {
    const selectedPatientId = event.target.value;
    const selectedPatientData = patients.find(patient => patient.patient_id === selectedPatientId);
    if (selectedPatientData) {
      selectedPatientName = `${selectedPatientData.first_name} ${selectedPatientData.last_name}`;
      patientQuery = selectedPatientName;
      selectedPatient = selectedPatientId;
      patients = []; // Clear the patients array to hide the dropdown
    }
  }
  
  function clearPatientSelection() {
    if (patientQuery.trim() === '') {
      selectedPatient = '';
      selectedPatientName = '';
    }
  }
  
  async function saveAppointment() {
    if (!selectedDate || !selectedTime || !selectedPatient || !clinicianId || !clinicianName) {
      console.error('All fields are required');
      return;
    }
  
    const appointmentData = {
      clinician_id: clinicianId,
      clinician_name: clinicianName,
      patient_id: selectedPatient,
      patient_name: selectedPatientName,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      notes: null,
      status: 'BOOKED',
    };
  
    const { data, error } = await supabase.from('appointments').insert([appointmentData]);
  
    if (error) {
      console.error('Error saving appointment:', error);
    } else {
      console.log('Appointment saved:', data);
      alert('Appointment saved successfully');
    }
  }
  
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
    const start = new Date();
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 45, 0, 0);
  
    while (start <= endOfDay) {
      slots.push(start.toTimeString().substring(0, 5));
      start.setMinutes(start.getMinutes() + 15);
    }
  
    return slots;
  }
  
  onMount(async () => {
    minDate = getMinDate();
    timeSlots = generateTimeSlots();
  
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('clinicians')
        .select('clinician_id, first_name, last_name')
        .eq('clinician_id', user.id)
        .single();
      if (error) {
        console.error('Error fetching clinician details:', error);
      } else {
        clinicianId = data.clinician_id;
        clinicianName = `${data.first_name} ${data.last_name}`;
      }
    }
  });
</script>
  
<style>
  .container {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .search-container {
    position: relative;
    margin-bottom: 1rem;
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
  
  .date-input, .time-input {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  label {
    margin-bottom: 0.5rem;
  }
  
  input[type="date"],
  select {
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .patient-select-container {
    position: relative;
    width: 100%;
  }
  
  .patient-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid #ccc;
    max-height: calc(3rem * 6); /* Max height for 5 entries + 1 for "Select a patient" */
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .patient-dropdown select {
    width: 100%;
    border: none;
    box-shadow: none;
  }
  
  .patient-dropdown option {
    padding: 10px;
    cursor: pointer;
  }
  
  .patient-dropdown option:hover {
    background-color: #f0f0f0;
  }
</style>
  
<div class="container">
  <div class="search-container">
    <label for="patient-search">Search Patient:</label>
    <input 
      id="patient-search" 
      type="text" 
      bind:value={patientQuery} 
      on:input={searchPatients} 
      on:blur={clearPatientSelection} 
      placeholder="Search by name"
      class="input-field"
    />
    {#if patients.length > 0}
      <div class="patient-dropdown">
        <select bind:value={selectedPatient} size={Math.min(patients.length + 1, 6)} style="height:100%;" on:change={handlePatientSelection}>
          <option value="">Select a patient</option>
          {#each patients as patient}
            <option value={patient.patient_id}>{patient.first_name} {patient.last_name}</option>
          {/each}
        </select>
      </div>
    {/if}
  </div>
  
  <div class="date-input">
    <label for="date">Select Date:</label>
    <input class="input-field" type="date" id="date" bind:value={selectedDate} min={minDate}>
  </div>
  
  <div class="time-input">
    <label for="time">Select Time:</label>
    <select class="input-field" bind:value={selectedTime}>
      <option value="">Select a time</option>
      {#each timeSlots as slot}
        <option value={slot}>{slot}</option>
      {/each}
    </select>
  </div>
  
  <button class="button" on:click={saveAppointment}>Save to Calendar</button>
</div>
