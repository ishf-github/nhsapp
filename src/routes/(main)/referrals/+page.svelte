<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '../../../supabaseClient'; // Adjust the path as necessary

  let departments = [];
  let selectedDepartment = '';
  let clinicians = [];
  let selectedClinician = '';
  let providerNotes = '';
  let patientQuery = '';
  let patients = [];
  let selectedPatient = '';
  let selectedPatientName = '';
  let referringClinicianId = ''; // This will hold the ID of the signed-in clinician
  let errorMessage = ''; // To hold error messages

  async function fetchDepartments() {
    const { data, error } = await supabase.from('department_list').select('department_name');
    if (error) {
      console.error('Error fetching departments:', error);
    } else {
      departments = data.map(dept => dept.department_name);
    }
  }

  async function fetchClinicians(department = '') {
    let query = supabase.from('clinicians').select('clinician_id, first_name, last_name');
    if (department) {
      query = query.eq('department', department);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching clinicians:', error);
    } else {
      clinicians = data;
    }
  }

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

  async function handleDepartmentSelection(event) {
    selectedDepartment = event.target.value;
    selectedClinician = ''; // Clear the selected clinician
    await fetchClinicians(selectedDepartment); // Fetch clinicians for the selected department
  }

  async function submitReferral() {
    if (!selectedPatient || !referringClinicianId || !selectedClinician || !selectedDepartment) {
      errorMessage = 'All fields are required.';
      console.error(errorMessage);
      return;
    }

    const referralData = {
      patient_id: selectedPatient,
      referring_clinician_id: referringClinicianId,
      referred_to_clinician_id: selectedClinician,
      referred_to_department: selectedDepartment,
      referral_date: new Date().toISOString(),
      referral_status: 'PENDING',
      notes: providerNotes,
    };

    const { data, error } = await supabase.from('referrals').insert([referralData]);

    if (error) {
      console.error('Error submitting referral:', error);
    } else {
      console.log('Referral submitted:', data);
      goto('/confirmation');
    }
  }

  function attachFiles() {
    console.log('Attaching files...');
  }

  onMount(async () => {
    await fetchDepartments();
    await fetchClinicians();

    // Fetch the signed-in clinician's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('clinicians')
        .select('clinician_id')
        .eq('clinician_id', user.id)
        .single();
      if (error) {
        console.error('Error fetching clinician ID:', error);
      } else {
        referringClinicianId = data.clinician_id;
      }
    }
  });
</script>

<style>
  .referral-page {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  select, textarea, input, button {
    width: 100%;
    padding-right: 0.1rem;
    margin-bottom: 0.5rem;
  }

  input, select {
    height: 3rem; 
  }

  button {
    cursor: pointer;
  }

  .attach-files-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 3rem; 
    background-color: #ccc; 
    border: none;
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

  .error-message {
    color: red;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
</style>

<div class="referral-page">
  {#if errorMessage}
    <div class="error-message">{errorMessage}</div>
  {/if}
  <div class="patient-select-container">
    <label for="patient-search">Search Patient:</label>
    <input 
      id="patient-search" 
      type="text" 
      bind:value={patientQuery} 
      on:input={searchPatients} 
      on:blur={clearPatientSelection} 
      placeholder="Search by name"
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

  <label for="department-select">Refer to Department:</label>
  <select id="department-select" bind:value={selectedDepartment} on:change={handleDepartmentSelection}>
    <option value="">Please select a department</option>
    {#each departments as department}
      <option value={department}>{department}</option>
    {/each}
  </select>

  <label for="clinician-select">Refer to Clinician:</label>
  <select id="clinician-select" bind:value={selectedClinician}>
    <option value="">Please select a clinician</option>
    {#each clinicians as clinician}
      <option value={clinician.clinician_id}>{clinician.first_name} {clinician.last_name}</option>
    {/each}
  </select>

  <div>
    <label for="attach-files">Attach Files:</label>
    <button class="attach-files-button" on:click={attachFiles}>ATTACH FILES</button>
  </div>

  <div>
    <label for="provider-notes">Provider Notes:</label>
    <textarea id="provider-notes" bind:value={providerNotes} rows="6"></textarea>
  </div>

  <button on:click={submitReferral}>SUBMIT REFERRAL</button>
</div>
