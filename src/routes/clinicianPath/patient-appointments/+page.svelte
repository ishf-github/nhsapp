<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  import { goto } from '$app/navigation';

  let appointments = [];
  let currentUser = null;

  onMount(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          appointment_id,
          appointment_date,
          appointment_time,
          status,
          patients (
            patient_id,
            first_name,
            last_name,
            date_of_birth,
            nhs_number
          )
        `)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error.message, error.hint, error.details);
      } else {
        appointments = data.map(appt => ({
          id: appt.appointment_id,
          patientId: appt.patients.patient_id,
          name: `${appt.patients.first_name} ${appt.patients.last_name}`,
          dob: appt.patients.date_of_birth,
          nhsNumber: appt.patients.nhs_number,
          nextAppt: appt.appointment_date,
          time: appt.appointment_time,
          status: appt.status
        }));
      }
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  });

  function viewRecord(patientId) {
    goto(`/patient-chart?patientId=${patientId}`);
  }

  function sendMessage(patientId) {
    if (currentUser) {
      const url = `/message-patient?receiverId=${patientId}&senderId=${currentUser.id}`;
      window.open(url, '_blank', 'width=800,height=600,noopener,noreferrer');
    } else {
      console.error('Current user is not defined.');
    }
  }

  function viewTasks(id) { /* ... */ }

  function navigateTo(page) {
    if (page === 'notes') {
      goto('../notes');
    } else if (page === 'appointment-booking-search') {
      goto('../appointment-booking-search');
    }
  }
</script>

<style>
  .appointment-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 12px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
  }

  .appointment-info {
    flex-grow: 1;
  }

  .appointment-details, .tasks-section {
    margin-bottom: 8px;
  }

  .appointment-actions {
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
    text-transform: capitalize;
  }

  .tasks-section {
    margin-top: 16px;
  }

  .task-status {
    font-style: italic;
    color: #555;
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

  .new-appointment-button {
    margin-bottom: 16px;
    padding: 12px;
    font-family: 'Frutiger', sans-serif;
    font-weight: normal;
    background-color: #005EB8;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    text-align: center;
    text-transform: capitalize;
  }
</style>

<div class="appointments-page">
  <button class="new-appointment-button" on:click={() => navigateTo('appointment-booking-search')}>New Appointment</button>
  
  {#each appointments as appointment (appointment.id)}
    <div class="appointment-container">
      <div class="appointment-info">
        <div class="appointment-details">
          <h2 style="font-family: 'Frutiger', sans-serif;">{appointment.name}</h2>
          <p>DoB: {appointment.dob}</p>
          <p>NHS Number: {appointment.nhsNumber}</p>
          <p>Next Appt: {appointment.nextAppt} {appointment.time}</p>
        </div>
        <div class="tasks-section">
          <p class="task-status">
            {#if appointment.status === 'Outstanding'}
              Outstanding Tasks: <button class="cta-button" on:click={() => viewTasks(appointment.id)}>View</button>
            {:else}
              No outstanding tasks
            {/if}
          </p>
        </div>
      </div>
      <div class="appointment-actions">
        <button class="cta-button" on:click={() => viewRecord(appointment.patientId)}>View Record</button>
        <button class="cta-button" on:click={() => sendMessage(appointment.patientId)}>Send Message</button>
      </div>
    </div>
  {/each}

  <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>
</div>
