<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  import { goto } from '$app/navigation';

  let appointments = [];
  let currentUser = null;
  let noAppointments = false;

  async function fetchAppointments() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error.message);
        return;
      }

      currentUser = session?.user;
      if (!currentUser) {
        console.error('User not authenticated');
        return;
      }

      // Fetch appointments
      const { data: appointmentsData, error: fetchAppointmentsError } = await supabase
        .from('appointments')
        .select(`
          appointment_id,
          appointment_date,
          appointment_time,
          clinician_name,
          patients (
            patient_id,
            first_name,
            last_name
          )
        `)
        .or(`clinician_id.eq.${currentUser.id},patient_id.eq.${currentUser.id}`)
        .order('appointment_date', { ascending: true });

      if (fetchAppointmentsError) {
        console.error('Error fetching appointments:', fetchAppointmentsError.message, fetchAppointmentsError.details);
      } else if (appointmentsData.length === 0) {
        noAppointments = true;
      } else {
        appointments = appointmentsData.map(appt => ({
          id: appt.appointment_id,
          date: appt.appointment_date,
          time: appt.appointment_time,
          clinicianName: appt.clinician_name,
          patientName: `${appt.patients.first_name} ${appt.patients.last_name}`
        }));
        noAppointments = false;
      }

    } catch (err) {
      console.error('Unexpected error fetching appointments:', err);
    }
  }

  function viewAppointment(appt) {
    const url = `/appointment-details?appointmentId=${appt.id}`;
    window.open(url, '_blank', 'width=600,height=400');
  }

  onMount(() => {
    fetchAppointments();
  });

  function navigateTo(page) {
    goto(`/${page}`);
  }
</script>

<style>
  .app-container {
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  .appointment-container {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid #ccc; 
  }

  .appointment-date {
    font-family: 'Frutiger', sans-serif;
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 5px;
  }

  .appointments-empty {
    text-align: center;
    margin-top: 50px;
    font-size: 18px;
    color: #888;
  }

  .appointment-info {
    margin-bottom: 8px;
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

<div class="app-container">
  {#if noAppointments}
    <div class="appointments-empty">No appointments found</div>
  {:else}
    <div class="appointment-list">
      {#each appointments as appt (appt.id)}
        <div class="appointment-container">
          <div class="appointment-date">{new Date(appt.date).toLocaleDateString()}</div>
          <div class="appointment-info">Time: {appt.time}</div>
          <div class="appointment-info">Clinician: {appt.clinicianName}</div>
        </div>
      {/each}
    </div>
  {/if}

  <button class="icon-round" on:click={() => navigateTo('notes')}>NOTES</button>
</div>
