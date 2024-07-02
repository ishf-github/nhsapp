<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';

  let prescriptions = [];

  async function fetchClinicianName(clinicianId) {
    const { data, error } = await supabase
      .from('clinicians')
      .select('first_name, last_name')
      .eq('clinician_id', clinicianId)
      .single();

    if (error) {
      console.error('Error fetching clinician name:', error);
      return 'Unknown Clinician';
    } else {
      return `${data.first_name} ${data.last_name}`;
    }
  }

  onMount(async () => {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('medication_id, clinician_id, start_date, end_date, prescription_term, notes')
      .eq('prescription_term', 'long_term');

    if (error) {
      console.error('Error fetching prescriptions:', error);
      return;
    }

    prescriptions = await Promise.all(data.map(async prescription => {
      const { data: medicationData, error: medicationError } = await supabase
        .from('medication')
        .select('name, brand_name, strength')
        .eq('medication_id', prescription.medication_id)
        .single();

      if (medicationError) {
        console.error('Error fetching medication:', medicationError);
        return null;
      }

      const clinicianName = await fetchClinicianName(prescription.clinician_id);

      return {
        ...prescription,
        medicationName: medicationData.name,
        brandName: medicationData.brand_name,
        strength: medicationData.strength,
        clinicianName: clinicianName
      };
    })).then(results => results.filter(prescription => prescription !== null));
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
    background-color: #005EB8;
    color: white;
    margin-bottom: 1rem;
    padding: 1rem;
    text-align: center;
    border-radius: 8px;
  }

  .prescription-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin-bottom: 1rem;
    font-family: Arial, sans-serif;
  }

  .prescription-container h2 {
    margin: 0 0 1rem 0;
    font-family: 'Frutiger', sans-serif;
  }

  .prescription-container p {
    margin: 0.5rem 0;
  }

  .prescription-container strong {
    display: block;
    margin-top: 0.5rem;
  }
</style>

<div class="container">
  <div class="header">Your Repeat Prescriptions</div>
  {#each prescriptions as prescription}
    <div class="prescription-container">
      <h2>Medication: {prescription.medicationName}</h2>
      <p>Brand: {prescription.brandName}</p>
      <p>Prescribed by {prescription.clinicianName}</p>
      <strong>Dosage</strong>
      <p>{prescription.strength}</p>
      <strong>Start Date</strong>
      <p>{new Date(prescription.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <strong>End Date</strong>
      <p>{new Date(prescription.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>
  {/each}
</div>
