<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';

  type Appointment = {
    date: string;
    department: string;
    hospital: string;
    notes: string[];
    medication: string[];
  };

  let appointment: Appointment = {
    date: '',
    department: '',
    hospital: '',
    notes: [],
    medication: []
  };

  onMount(async () => {
    const { data, error } = await supabase
      .from('hospital_appointments')
      .select('date, department, hospital, notes, medication')
      .eq('id', 1) // Replace with the actual appointment ID
      .single();

    if (error) {
      console.error('Error fetching appointment:', error);
    } else if (data) {
      appointment = data as Appointment;
    }
  });
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

  .appointment-info {
    background-color: #f0f0f0;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
  }

  .appointment-info h2 {
    margin: 0 0 1rem 0;
  }

  .appointment-info p {
    margin: 0.5rem 0;
  }

  .appointment-info ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  .appointment-info li {
    margin-bottom: 0.5rem;
  }
</style>

<div class="container">
  <div class="header">Hospital Appointment Information</div>
  <div class="appointment-info">
    <h2>{appointment.date ? new Date(appointment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</h2>
    <p>{appointment.department}, {appointment.hospital}</p>
    <p><strong>Comments:</strong></p>
    <ul>
      {#each appointment.notes as note}
        <li>{note}</li>
      {/each}
    </ul>
    <p><strong>Medication:</strong></p>
    <ul>
      {#each appointment.medication as med}
        <li>{med}</li>
      {/each}
    </ul>
  </div>
</div>
