<script>
    import { onMount } from 'svelte';
    import { supabase } from '../../../supabaseClient';
  
    let appointments = [];
  
    // Fetch appointments from the database on component mount
    onMount(async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date, clinician, gp_practice');
  
      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        appointments = data;
      }
    });
  
    function handleClick(appointment) {
      // Handle the click event, e.g., navigate to an appointment details page
      console.log('Clicked appointment:', appointment);
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
  
    .header {
      font-weight: bold;
      margin-bottom: 1rem;
      background-color: #d3d3d3;
      padding: 1rem;
      text-align: center;
    }
  
    .appointment {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #d3d3d3;
      margin-bottom: 1rem;
      cursor: pointer;
      border: none;
      width: 100%;
    }
  
    .appointment:hover {
      background-color: #ccc;
    }
  
    .arrow {
      font-size: 1.5rem;
    }
  </style>
  
  <div class="container">
    <div class="header">GP SURGERY APPOINTMENTS</div>
    {#each appointments as appointment}
      <div class="appointment" on:click={() => handleClick(appointment)}>
        <div>
          <div>{new Date(appointment.appointment_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}</div>
          <div>{appointment.clinician}, {appointment.gp_practice}</div>
        </div>
        <span class="arrow">➔</span>
      </div>
    {/each}
  </div>
  