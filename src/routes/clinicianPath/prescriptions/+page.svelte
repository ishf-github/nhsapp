<script>
    import { onMount } from 'svelte';
    import { supabase } from '../../../supabaseClient';
    import { goto } from '$app/navigation';
  
    let prescriptions = [];
    let currentUser = null;
    let listEmpty = false;
  
    async function fetchPrescriptions() {
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
  
        const { data, error: fetchError } = await supabase
          .from('prescriptions')
          .select(`
            prescription_id,
            start_date,
            end_date,
            notes,
            prescription_term,
            clinician_id,
            patient_id,
            patients (
              first_name,
              last_name
            ),
            medication (
              name
            )
          `)
          .eq('clinician_id', currentUser.id)
          .order('start_date', { ascending: false });
  
        if (fetchError) {
          console.error('Error fetching prescriptions:', fetchError.message, fetchError.details);
        } else if (data.length === 0) {
          listEmpty = true;
        } else {
          prescriptions = data.map(prescription => ({
            id: prescription.prescription_id,
            patientName: `${prescription.patients.first_name} ${prescription.patients.last_name}`,
            medicationName: prescription.medication.name,
            startDate: prescription.start_date,
            endDate: prescription.end_date,
            notes: prescription.notes,
            term: prescription.prescription_term
          }));
          listEmpty = false;
        }
      } catch (err) {
        console.error('Unexpected error fetching prescriptions:', err);
      }
    }
  
    function navigateTo(page) {
      goto(page);
    }
  
    onMount(() => {
      fetchPrescriptions();
    });
  </script>
  
  <style>
    .app-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
  
    .prescription-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      line-height: 1.6;
    }
  
    .icon-round, .new-prescription-button {
      width: 150px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      background-color: #005EB8;
      color: white;
      font-family: 'Frutiger', sans-serif;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      border: none;
      border-radius: 4px;
      text-align: center;
      text-transform: capitalize;
      margin-bottom: 20px;
    }
  
    .list-empty {
      text-align: center;
      margin-top: 50px;
      font-size: 18px;
      color: #888;
    }
  
    .patient-name {
      font-size: 1.5rem;
      font-family: 'Frutiger', sans-serif;
    }
  
    .send-message-button {
      padding: 0px 12px;
      font-family: 'Frutiger', sans-serif;
      font-weight: normal;
      background-color: #005EB8;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      text-align: center;
      text-transform: capitalize;
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
  </style>
  
  <div class="app-container">
    <button class="new-prescription-button" on:click={() => navigateTo('/clinicianPath/write-prescription')}>New Prescription</button>
    
    {#if listEmpty}
      <div class="list-empty">No prescriptions found</div>
    {:else}
      {#each prescriptions as prescription (prescription.id)}
        <div class="prescription-container">
          <div>
            <div class="patient-name"><strong>{prescription.patientName}</strong></div>
            <div style="font-family: Arial, sans-serif;">Medication: {prescription.medicationName}</div>
            <div style="font-family: Arial, sans-serif;">Start Date: {prescription.startDate}</div>
            <div style="font-family: Arial, sans-serif;">End Date: {prescription.endDate}</div>
            <div style="font-family: Arial, sans-serif;">Term: {prescription.term}</div>
            <div class="message-preview" style="font-family: Arial, sans-serif;">Notes: {prescription.notes}</div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
  