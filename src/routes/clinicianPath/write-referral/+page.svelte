<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { supabase } from '../../../supabaseClient';
    import { goto } from '$app/navigation';
  
    let selectedPatient = '';
    let selectedPatientName = '';
    let patientQuery = '';
    let patients = [];
    
    let selectedDepartment = '';
    let departments = [];
    
    let selectedClinician = '';
    let clinicians = [];
    
    let notes = '';
    
    const showModal = writable(false);
    let minDate;
  
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
  
    async function fetchDepartments() {
      const { data, error } = await supabase
        .from('department_list')
        .select('department_name');
    
      if (error) {
        console.error('Error fetching departments:', error);
        departments = [];
      } else {
        departments = data;
      }
    }
  
    async function fetchClinicians() {
      if (selectedDepartment) {
        const { data, error } = await supabase
          .from('clinicians')
          .select('clinician_id, first_name, last_name')
          .eq('department', selectedDepartment);
    
        if (error) {
          console.error('Error fetching clinicians:', error);
          clinicians = [];
        } else {
          clinicians = data;
        }
      }
    }
  
    async function saveReferral() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
  
        if (sessionData && sessionData.session) {
          const referringClinicianId = sessionData.session.user.id;
  
          if (!selectedPatient || !selectedDepartment || !selectedClinician) {
            throw new Error('All fields are required');
          }
  
          const referralData = {
            patient_id: selectedPatient,
            referring_clinician_id: referringClinicianId,
            referred_to_clinician_id: selectedClinician,
            referred_to_department: selectedDepartment,
            referral_date: new Date().toISOString().split('T')[0],
            referral_status: 'PENDING',
            notes
          };
  
          const { data, error } = await supabase.from('referrals').insert([referralData]);
  
          if (error) {
            console.error('Error saving referral:', error);
          } else {
            console.log('Referral saved:', data);
            alert('Referral saved successfully');
            goto('/referrals');
          }
        }
      } catch (error) {
        console.error('Error saving referral:', error);
      }
    }
  
    onMount(() => {
      fetchDepartments();
    });
  
    $: if (selectedDepartment) {
      fetchClinicians();
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
  
    <div class="department-select-container">
      <label for="department-select">Refer to Department:</label>
      <select id="department-select" class="input-field" bind:value={selectedDepartment}>
        <option value="">Select a department</option>
        {#each departments as department}
          <option value={department.department_name}>{department.department_name}</option>
        {/each}
      </select>
    </div>
  
    <div class="clinician-select-container">
      <label for="clinician-select">Refer to Clinician:</label>
      <select id="clinician-select" class="input-field" bind:value={selectedClinician}>
        <option value="">Select a clinician</option>
        {#each clinicians as clinician}
          <option value={clinician.clinician_id}>{clinician.first_name} {clinician.last_name}</option>
        {/each}
      </select>
    </div>
  
    <div class="notes-container">
      <label for="notes">Notes:</label>
      <textarea id="notes" class="input-field" bind:value={notes} placeholder="Enter any notes here..."></textarea>
    </div>
  
    <button class="button" on:click={saveReferral}>Refer Patient</button>
  </div>
  