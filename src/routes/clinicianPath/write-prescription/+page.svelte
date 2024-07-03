<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { supabase } from '../../../supabaseClient';

  let patientQuery = '';
  let medicationQuery = '';
  let patients = [];
  let medications = [];
  let selectedPatient = '';
  let selectedPatientName = '';
  let selectedMedication = '';
  let selectedMedicationName = '';
  let startDate = '';
  let endDate = '';
  let notes = '';
  let clinicianId = '';
  const showModal = writable(false);
  let minDate;
  let maxDate;

  // Search for patients
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

  // Search for medication
  async function searchMedications() {
    if (medicationQuery.trim() !== '' && medicationQuery !== selectedMedicationName) {
      const { data, error } = await supabase
        .from('medication')
        .select('medication_id, name')
        .ilike('name', `%${medicationQuery}%`);

      if (error) {
        console.error('Error searching medications:', error);
        medications = [];
      } else {
        medications = data;
      }
    } else {
      medications = [];
    }
  }

  // Select patient from dropdown
  function handlePatientSelection(event) {
    const selectedPatientId = event.target.value;
    const selectedPatientData = patients.find(patient => patient.patient_id === selectedPatientId);
    if (selectedPatientData) {
      selectedPatientName = `${selectedPatientData.first_name} ${selectedPatientData.last_name}`;
      patientQuery = selectedPatientName;
      selectedPatient = selectedPatientId;
      patients = [];
    }
  }

  // Select medication from dropdown
  function handleMedicationSelection(event) {
    const selectedMedicationId = event.target.value;
    const selectedMedicationData = medications.find(medication => medication.medication_id === selectedMedicationId);
    if (selectedMedicationData) {
      selectedMedicationName = selectedMedicationData.name;
      medicationQuery = selectedMedicationName;
      selectedMedication = selectedMedicationId;
      medications = [];
    }
  }

  // Clear patient selection if input is empty
  function clearPatientSelection() {
    if (patientQuery.trim() === '') {
      selectedPatient = '';
      selectedPatientName = '';
    }
  }

  // Clear medication selection if input is empty
  function clearMedicationSelection() {
    if (medicationQuery.trim() === '') {
      selectedMedication = '';
      selectedMedicationName = '';
    }
  }

  // Save prescription
  async function savePrescription() {
    if (!selectedPatient || !selectedMedication || !startDate || !endDate || !clinicianId) {
      console.error('All fields are required');
      return;
    }

    //Set prescription to short-term or long-term
    const prescriptionTerm = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) <= 42 ? 'short_term' : 'long_term';

    const prescriptionData = {
      clinician_id: clinicianId,
      patient_id: selectedPatient,
      medication_id: selectedMedication,
      start_date: startDate,
      end_date: endDate,
      notes,
      prescription_term: prescriptionTerm,
    };

    const { data, error } = await supabase.from('prescriptions').insert([prescriptionData]);

    if (error) {
      console.error('Error saving prescription:', error);
    } else {
      alert('Prescription saved successfully');
    }
  }

  // Set minimum date to today
  function getMinDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 3 Month maximum date
  function getMaxDate() {
    const now = new Date();
    now.setMonth(now.getMonth() + 3);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Weekend check
  function isWeekend(date) {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  }

  // Validate date input and prevent selection of weekends
  function validateDateInput(event) {
    const date = event.target.value;
    if (isWeekend(date)) {
      alert('Start Date and End Date cannot be a weekend.');
      event.target.value = '';
    }
  }

  // Fetch initial data and set up component when it mounts
  onMount(async () => {
    minDate = getMinDate();
    maxDate = getMaxDate();

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
      font-family: Arial, sans-serif;
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
      background-color: #005EB8;
      color: white;
      padding: 1rem 2rem;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      font-family: 'Frutiger', sans-serif;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
      width: 100%;
      border: none;
    }
  
    .date-input, .type-input {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  
    label {
      margin-bottom: 0.5rem;
    }
  
    input[type="date"] {
      max-width: 100%;
      box-sizing: border-box;
    }
  
    .patient-dropdown, .medication-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background-color: white;
      border: 1px solid #ccc;
      max-height: calc(3rem * 6);
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .patient-dropdown select, .medication-dropdown select {
      width: 100%;
      border: none;
      box-shadow: none;
    }
  
    .patient-dropdown option, .medication-dropdown option {
      padding: 10px;
      cursor: pointer;
    }
  
    .patient-dropdown option:hover, .medication-dropdown option:hover {
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
  
    <div class="search-container">
      <label for="medication-search">Search Medication:</label>
      <input 
        id="medication-search" 
        type="text" 
        bind:value={medicationQuery} 
        on:input={searchMedications} 
        on:blur={clearMedicationSelection} 
        placeholder="Search by name"
        class="input-field"
      />
      {#if medications.length > 0}
        <div class="medication-dropdown">
          <select bind:value={selectedMedication} size={Math.min(medications.length + 1, 6)} style="height:100%;" on:change={handleMedicationSelection}>
            <option value="">Select a medication</option>
            {#each medications as medication}
              <option value={medication.medication_id}>{medication.name}</option>
            {/each}
          </select>
        </div>
      {/if}
    </div>
  
    <div class="date-input">
      <label for="start-date">Start Date:</label>
      <input class="input-field" type="date" id="start-date" bind:value={startDate} min={minDate} max={maxDate} on:change={validateDateInput}>
    </div>
  
    <div class="date-input">
      <label for="end-date">End Date:</label>
      <input class="input-field" type="date" id="end-date" bind:value={endDate} min={minDate} max={maxDate} on:change={validateDateInput}>
    </div>
  
    <div class="type-input">
      <label for="notes">Notes:</label>
      <textarea class="input-field" id="notes" bind:value={notes}></textarea>
    </div>
  
    <button class="button" on:click={savePrescription}>Save Prescription</button>
  </div>
  