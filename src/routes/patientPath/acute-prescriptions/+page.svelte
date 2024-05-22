<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '../../../supabaseClient';
  
    type Prescription = {
      medication: string;
      date_prescribed: string;
      dosage: string;
      dosage_instructions: string;
      clinician_notes: string;
    };
  
    let prescriptions: Prescription[] = [];
  
    onMount(async () => {
      const { data, error } = await supabase
        .from('acute_prescriptions')
        .select('medication, date_prescribed, dosage, dosage_instructions, clinician_notes');
  
      if (error) {
        console.error('Error fetching prescriptions:', error);
      } else {
        prescriptions = data as Prescription[];
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
        font-family: 'Frutiger', sans-serif;
      font-weight: bold;
      background-color:#005EB8;
      color: white;
      margin-bottom: 1rem;
      padding: 1rem;
      text-align: center;
    }
  
    .prescription-info {
      background-color: #f0f0f0;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
    }
  
    .prescription-info h2 {
      margin: 0 0 1rem 0;
    }
  
    .prescription-info p {
      margin: 0.5rem 0;
    }
  
    .prescription-info strong {
      display: block;
      margin-top: 0.5rem;
    }
  </style>
  
  <div class="container">
    <div class="header">Your Short-term Prescriptions</div>
    {#each prescriptions as prescription}
      <div class="prescription-info">
        <h2>{prescription.medication}</h2>
        <p>Prescribed {new Date(prescription.date_prescribed).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <strong>Dosage</strong>
        <p>{prescription.dosage}</p>
        <strong>Dosage Instructions</strong>
        <p>{prescription.dosage_instructions}</p>
        <strong>Provider Notes:</strong>
        <p>{prescription.clinician_notes}</p>
      </div>
    {/each}
  </div>
  