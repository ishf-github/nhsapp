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
          time: appt.appointment_time.slice(0, 5),
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
  .container {
    font-family: 'Frutiger', sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 16px;
  }

  .header {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 16px;
  }

  .appointment-card {
    background-color: #fff;
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .appointment-info {
    margin-bottom: 8px;
    font-family: 'Arial', sans-serif;
  }

  .appointment-date {
    font-family: 'Frutiger', sans-serif;
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .appointments-empty {
    text-align: center;
    margin-top: 50px;
    font-size: 18px;
    color: #888;
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

  .bold-text {
    font-weight: bold;
  }
</style>

<div class="container">
  <div class="header">My Appointments</div>
  {#if noAppointments}
    <div class="appointments-empty">No appointments found</div>
  {:else}
    {#each appointments as appt (appt.id)}
      <div class="appointment-card" on:click={() => viewAppointment(appt)}>
        <div class="appointment-date">{new Date(appt.date).toLocaleDateString()}</div>
        <div class="appointment-info"><span class="bold-text">Time:</span> {appt.time}</div>
        <div class="appointment-info"><span class="bold-text">Clinician:</span> {appt.clinicianName}</div>
      </div>
    {/each}
  {/if}
</div>
