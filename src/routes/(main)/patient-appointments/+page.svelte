<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  import { goto } from '$app/navigation';

  let appointments = [];

  onMount(async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          appointment_id,
          appointment_date,
          appointment_time,
          status,
          patients (
            first_name,
            last_name,
            date_of_birth,
            nhs_number
          )
        `);
      
      if (error) {
        console.error("Error fetching appointments:", error.message, error.hint, error.details);
      } else {
        appointments = data.map(appt => ({
          id: appt.appointment_id,
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

  function viewRecord(id) { /* ... */ }
  function sendMessage(id) { /* ... */ }
  function manageAppt(id) { /* ... */ }
  function viewTasks(id) { /* ... */ }
  function bookAppt(id) { /* ... */ }

  function navigateTo(page) {
    if (page === 'notes') {
      goto('../notes');
    } else if (page === 'appointment-booking') {
      goto('../appointment-booking');
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
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    cursor: pointer;
    margin-top: 8px;
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
</style>

<div class="appointments-page">
  {#each appointments as appointment (appointment.id)}
    <div class="appointment-container">
      <div class="appointment-info">
        <button class="cta-button" on:click={() => navigateTo('appointment-booking')}>New Appointment</button>
        <div class="appointment-details">
          <h2>{appointment.name}</h2>
          <p>DoB: {appointment.dob}</p>
          <p>NHS Number: {appointment.nhsNumber}</p>
          <p>Next Appt: {appointment.nextAppt} {appointment.time}</p>
        </div>
        <div class="tasks-section">
          <p class="task-status">
            {#if appointment.status === 'Outstanding'}
              Outstanding Tasks: <button class="cta-button" on:click={() => viewTasks(appointment.id)}>VIEW</button>
            {:else}
              No outstanding tasks
            {/if}
          </p>
        </div>
      </div>
      <div class="appointment-actions">
        <button class="cta-button" on:click={() => viewRecord(appointment.id)}>VIEW RECORD</button>
        <button class="cta-button" on:click={() => sendMessage(appointment.id)}>SEND MESSAGE</button>
        <button class="cta-button" on:click={() => manageAppt(appointment.id)}>MANAGE APPT</button>
        <button class="cta-button" on:click={() => bookAppt(appointment.id)}>BOOK APPT</button>
      </div>
    </div>
  {/each}

  <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>
</div>
