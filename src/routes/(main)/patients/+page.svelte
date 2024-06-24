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

  function handleAction(button, patientId) {
    if (button === 'View Record') {
      goto(`/patient-chart?patientId=${patientId}`); 
    }

    if (button === 'Send Message') {
      if (currentUser) {
        const url = `/message-patient?receiverId=${patientId}&senderId=${currentUser.id}`;
        window.open(url, '_blank', 'width=800,height=600,noopener,noreferrer');
      } else {
        console.error('Current user is not defined.');
      }
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
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    cursor: pointer;
    margin-top: 8px;
  }

  .button {
    margin-top: 8px; 
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
        <button class="button" on:click={() => handleAction('View Tasks', patient.patient_id)}>VIEW</button>
      </div>
      <div class="patient-actions">
        <button class="cta-button" on:click={() => handleAction('View Record', patient.patient_id)}>VIEW RECORD</button>
        <button class="cta-button" on:click={() => handleAction('Send Message', patient.patient_id)}>SEND MESSAGE</button>
        <button class="cta-button" on:click={() => handleAction('Schedule Appt', patient.patient_id)}>SCHEDULE APPT</button>
        <button class="cta-button" on:click={() => handleAction('Refer', patient.patient_id)}>REFER</button>
      </div>
    </div>
  {/each}

  <button class="icon-button icon-round" on:click={() => handleAction('notes')}>NOTES</button>
</div>
