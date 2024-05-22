<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';

  // Define the type for the appointment object
  type Appointment = {
    date: string;
    practice: string;
    notes: string[];
    medication: string[];
  };

  // Initialize appointment with default values
  let appointment: Appointment = {
    date: '',
    practice: '',
    notes: [],
    medication: []
  };

  // Fetch appointment info from the database on component mount
  onMount(async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('date, practice, notes, medication')
      .eq('id', 1) // Assuming you fetch appointment by id, replace 1 with the actual id
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
    font-family: 'Arial', sans-serif;
    font-weight: normal;
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }

  .header {
    font-family: 'Frutiger', sans-serif;
    font-weight: bold;
    margin-bottom: 1rem;
    background-color: #005EB8;
    color: white;
    padding: 1rem;
    text-align: center;
  }

  .appointment-info {
    background-color: #f0f0f0;
    padding: 1rem;
    margin-bottom: 1rem;
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
  <div class="header">Appointment information</div>
  <div class="appointment-info">
    <h2>{appointment.date ? new Date(appointment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</h2>
    <p>{appointment.practice}</p>
    <p><strong>Comments:</strong></p>
    <ul>
      {#each appointment.notes as note}
        <li>{note}</li>
      {/each}
    </ul>
    <p><strong>Prescription:</strong></p>
    <ul>
      {#each appointment.medication as med}
        <li>{med}</li>
      {/each}
    </ul>
  </div>
</div>
