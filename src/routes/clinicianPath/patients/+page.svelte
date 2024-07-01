<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '../../../supabaseClient';

  let patients = [];
  let currentUser = null;

  onMount(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;
      }

      const { data, error } = await supabase
        .from('patients')
        .select('patient_id, first_name, last_name, date_of_birth, sex, nhs_number');

      if (error) {
        console.error('Error fetching patients:', error.message, error.hint, error.details);
      } else if (data.length === 0) {
        console.warn('No patients found. Make sure the table is populated.');
      } else {
        patients = data;
        console.log('Fetched patients:', patients);
      }
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  });

  function handleAction(button, patient) {
    if (button === 'View Record') {
      goto(`/clinicianPath/patient-chart?patientId=${patient.patient_id}`);
    }

    if (button === 'Send Message') {
      if (currentUser) {
        const url = `/message-patient?receiverId=${patient.patient_id}&senderId=${currentUser.id}`;
        window.open(url, '_blank', 'width=800,height=600,noopener,noreferrer');
      } else {
        console.error('Current user is not defined.');
      }
    }

    if (button === 'Book Appt') {
      goto(`/clinicianPath/appointment-booking-search?patientId=${patient.patient_id}&patientName=${encodeURIComponent(patient.first_name + ' ' + patient.last_name)}`);
    }

    if (button === 'Refer') {
      goto(`/clinicianPath/write-referral?patientId=${patient.patient_id}`);
    }

    if (button === 'Write Prescription') {
      goto(`/clinicianPath/write-prescription?patientId=${patient.patient_id}`);
    }
  }
</script>

<style>
  .patient-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 12px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    font-family: 'Frutiger', sans-serif;
  }

  .patient-info {
    flex-grow: 1;
  }

  .patient-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .cta-button {
    padding: 6px 12px;
    font-family: 'Frutiger', sans-serif;
    font-weight: normal;
    background-color: #005EB8;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 8px;
    border-radius: 4px;
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

<div class="patients-page">
  {#each patients as patient}
    <div class="patient-container">
      <div class="patient-info">
        <h2>{patient.first_name} {patient.last_name}</h2>
        <p>Dob: {new Date(patient.date_of_birth).toLocaleDateString()}</p>
        <p>Sex: {patient.sex}</p>
        <p>NHS Number: {patient.nhs_number}</p>
      </div>
      <div class="patient-actions">
        <button class="cta-button" on:click={() => handleAction('View Record', patient)}>View Record</button>
        <button class="cta-button" on:click={() => handleAction('Send Message', patient)}>Send Message</button>
        <button class="cta-button" on:click={() => handleAction('Book Appt', patient)}>Book Appt</button>
        <button class="cta-button" on:click={() => handleAction('Refer', patient)}>Refer</button>
        <button class="cta-button" on:click={() => handleAction('Write Prescription', patient)}>Write Prescription</button>
      </div>
    </div>
  {/each}

  <button class="icon-button icon-round" on:click={() => handleAction('notes')}>NOTES</button>
</div>
