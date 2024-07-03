<script>
  import { onMount } from 'svelte'; 
  import { supabase } from '../../../supabaseClient'; 
  import { goto } from '$app/navigation'; 

  let appointments = [];
  let currentUser = null;

  // Fetch appointments and user data when the component mounts
  onMount(async () => {
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;
      }

      // Fetch appointments from database
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          appointment_id,
          appointment_date,
          appointment_time,
          appointment_type,
          status,
          patient_id,
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
        // Map and display data
        appointments = data.map(appt => ({
          id: appt.appointment_id,
          patientId: appt.patient_id,
          name: `${appt.patients?.first_name || 'Unknown'} ${appt.patients?.last_name || 'Unknown'}`,
          dob: appt.patients?.date_of_birth || 'Unknown',
          nhsNumber: appt.patients?.nhs_number || 'Unknown',
          nextAppt: appt.appointment_date,
          time: appt.appointment_time,
          appointmentType: appt.appointment_type,
          status: appt.status
        }));
      }
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  });

  // View patient chart
  function viewRecord(patientId) {
    goto(`/clinicianPath/patient-chart?patientId=${patientId}`);
  }

  // Send message to patient
  function sendMessage(patientId) {
    if (currentUser) {
      const url = `/message-patient?receiverId=${patientId}&senderId=${currentUser.id}`;
      window.open(url, '_blank', 'width=800,height=600,noopener,noreferrer');
    } else {
      console.error('Current user is not defined.');
    }
  }

  // Join video call for appointment
  function joinCall(appointment) {
    const url = `/video-call`;
    window.open(url, '_blank', 'width=1120,height=700,noopener,noreferrer');
  }

  // Navigation
  function navigateTo(page) {
    goto(page);
  }

  // Check if an appointment is joinable (within 15 minutes of appointment time)
  function isJoinable(appointment) {
    if (appointment.appointmentType !== 'Video Call') {
      return false;
    }
    const appointmentDateTime = new Date(`${appointment.nextAppt}T${appointment.time}`);
    const now = new Date();
    const diff = (appointmentDateTime - now) / (1000 * 60);
    return diff <= 15 && diff >= 0;
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

  .appointment-details {
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
  <button class="new-appointment-button" on:click={() => navigateTo('/clinicianPath/appointment-booking-search')}>New Appointment</button>
  
  {#each appointments as appointment (appointment.id)}
    <div class="appointment-container">
      <div class="appointment-info">
        <div class="appointment-details">
          <h2 style="font-family: 'Frutiger', sans-serif;">{appointment.name}</h2>
          <p>DoB: {appointment.dob}</p>
          <p>NHS Number: {appointment.nhsNumber}</p>
          <p>Next Appt: {appointment.nextAppt} {appointment.time}</p>
          <p>Type: {appointment.appointmentType}</p>
        </div>
      </div>
      <div class="appointment-actions">
        <button class="cta-button" on:click={() => viewRecord(appointment.patientId)}>View Record</button>
        <button class="cta-button" on:click={() => sendMessage(appointment.patientId)}>Send Message</button>
        <!-- Button to join video call if the appointment is joinable -->
        {#if isJoinable(appointment)}
          <button class="cta-button" on:click={() => joinCall(appointment)}>Join Call</button>
        {/if}
      </div>
    </div>
  {/each}
</div>
