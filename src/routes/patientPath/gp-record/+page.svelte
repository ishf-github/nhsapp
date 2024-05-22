<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '../../../supabaseClient';

  let patient = {
    name: 'NAME SURNAME',
    dob: '01/01/1991',
    nhsNumber: '000 000 0000',
    address: 'Line 1, Line 2, City, County, Postcode'
  };

  let counts = {
    allergies: 0,
    medicines: 0,
    immunisations: 0,
    conditions: 0,
    results: 0,
    appointments: 0,
    documents: 0
  };

  onMount(async () => {
    try {
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('name, dob, nhsNumber, address')
        .eq('id', 1) // Replace with the actual patient ID
        .single();
      if (patientError) throw patientError;
      patient = patientData;

      const { data: allergiesCount, error: allergiesError } = await supabase
        .from('allergies')
        .select('id', { count: 'exact' })
        .eq('patient_id', 1); // Replace with the actual patient ID
      if (allergiesError) throw allergiesError;
      counts.allergies = allergiesCount.length;

      const { data: medicinesCount, error: medicinesError } = await supabase
        .from('medicines')
        .select('id', { count: 'exact' })
        .eq('patient_id', 1); // Replace with the actual patient ID
      if (medicinesError) throw medicinesError;
      counts.medicines = medicinesCount.length;

      const { data: immunisationsCount, error: immunisationsError } = await supabase
        .from('immunisations')
        .select('id', { count: 'exact' })
        .eq('patient_id', 1); // Replace with the actual patient ID
      if (immunisationsError) throw immunisationsError;
      counts.immunisations = immunisationsCount.length;

      const { data: conditionsCount, error: conditionsError } = await supabase
        .from('conditions')
        .select('id', { count: 'exact' })
        .eq('patient_id', 1); // Replace with the actual patient ID
      if (conditionsError) throw conditionsError;
      counts.conditions = conditionsCount.length;

      const { data: resultsCount, error: resultsError } = await supabase
        .from('results')
        .select('id', { count: 'exact' })
        .eq('patient_id', 1); // Replace with the actual patient ID
      if (resultsError) throw resultsError;
      counts.results = resultsCount.length;

      const { data: appointmentsCount, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('patient_id', 1); // Replace with the actual patient ID
      if (appointmentsError) throw appointmentsError;
      counts.appointments = appointmentsCount.length;

      const { data: documentsCount, error: documentsError } = await supabase
        .from('documents')
        .select('id', { count: 'exact' })
        .eq('patient_id', 1); // Replace with the actual patient ID
      if (documentsError) throw documentsError;
      counts.documents = documentsCount.length;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

  function navigateTo(page) {
    goto(`/patientPath/${page}`);
  }
</script>

<style>
  .container {
    font-family: 'Frutiger', sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 16px;
  }

  .section {
    margin-bottom: 20px;
  }

  .header {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 8px;
  }

  .subheader {
    font-weight: bold;
    margin-bottom: 16px;
  }

  .info {
    margin-bottom: 4px;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .button {
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }

  .button:hover {
    color: #8F2855;
  }

  .button span {
    font-size: 18px;
  }

  .arrow {
    font-size: 20px;
  }

  @media (max-width: 600px) {
    .container {
      padding: 8px;
    }

    .button {
      padding: 8px;
    }

    .arrow {
      font-size: 18px;
    }
  }
</style>

<div class="container">
  <div class="section">
    <div class="header">{patient.name}</div>
    <div class="info">DoB: {new Date(patient.dob).toLocaleDateString('en-GB')}</div>
    <div class="info">NHS Number: {patient.nhsNumber}</div>
  </div>

  <div class="section">
    <div class="subheader">Contact Details:</div>
    <div class="info">Address:</div>
    <div class="info">{patient.address}</div>
  </div>

  <div class="section">
    <div class="subheader">Medical Information:</div>
    <div class="buttons">
      <button class="button" on:click={() => navigateTo('my-allergies')}>
        <span>Allergies and adverse reactions</span>
        <span>{counts.allergies} <span class="arrow">→</span></span>
      </button>
      <button class="button" on:click={() => navigateTo('my-prescriptions')}>
        <span>Medicines</span>
        <span>{counts.medicines} <span class="arrow">→</span></span>
      </button>
      <button class="button" on:click={() => navigateTo('my-immunisations')}>
        <span>Immunisations</span>
        <span>{counts.immunisations} <span class="arrow">→</span></span>
      </button>
      <button class="button" on:click={() => navigateTo('my-conditions')}>
        <span>Health conditions</span>
        <span>{counts.conditions} <span class="arrow">→</span></span>
      </button>
      <button class="button" on:click={() => navigateTo('my-tests')}>
        <span>Test results</span>
        <span>{counts.results} <span class="arrow">→</span></span>
      </button>
      <button class="button" on:click={() => navigateTo('view-appointments')}>
        <span>Upcoming and past appts</span>
        <span>{counts.appointments} <span class="arrow">→</span></span>
      </button>
      <button class="button" on:click={() => navigateTo('my-documents')}>
        <span>Documents</span>
        <span>{counts.documents} <span class="arrow">→</span></span>
      </button>
    </div>
  </div>
</div>
