<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  import { goto } from '$app/navigation';

  let referrals = [];
  let errorMessage = '';

  async function fetchReferrals() {
    try {
      console.log('Fetching session data...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      console.log('Session data:', sessionData);

      if (sessionData && sessionData.session) {
        const clinicianId = sessionData.session.user.id;
        console.log('Clinician ID:', clinicianId);

        const { data: referralsData, error: referralsError } = await supabase
          .from('referrals')
          .select('referral_id, patient_id, referring_clinician_id, referred_to_clinician_id, referred_to_department, referral_date')
          .eq('referring_clinician_id', clinicianId)
          .order('referral_date', { ascending: false });

        if (referralsError) throw referralsError;

        console.log('Referrals data:', referralsData);

        referrals = await Promise.all(referralsData.map(async (referral) => {
          console.log('Fetching referring clinician for referral ID:', referral.referral_id);
          const { data: referringClinician, error: referringClinicianError } = await supabase
            .from('clinicians')
            .select('first_name, last_name')
            .eq('clinician_id', referral.referring_clinician_id)
            .single();

          if (referringClinicianError) throw referringClinicianError;

          console.log('Referring clinician:', referringClinician);

          console.log('Fetching referred to clinician for referral ID:', referral.referral_id);
          const { data: referredToClinician, error: referredToClinicianError } = await supabase
            .from('clinicians')
            .select('first_name, last_name')
            .eq('clinician_id', referral.referred_to_clinician_id)
            .single();

          if (referredToClinicianError) throw referredToClinicianError;

          console.log('Referred to clinician:', referredToClinician);

          console.log('Fetching patient for referral ID:', referral.referral_id);
          const { data: patient, error: patientError } = await supabase
            .from('patients')
            .select('first_name, last_name')
            .eq('patient_id', referral.patient_id)
            .single();

          if (patientError) throw patientError;

          console.log('Patient:', patient);

          return {
            ...referral,
            referring_clinician_name: `${referringClinician.first_name} ${referringClinician.last_name}`,
            referred_to_clinician_name: `${referredToClinician.first_name} ${referredToClinician.last_name}`,
            patient_name: `${patient.first_name} ${patient.last_name}`
          };
        }));

        console.log('Final referrals:', referrals);
      } else {
        console.error('No session data found');
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
      errorMessage = error.message;
    }
  }

  onMount(() => {
    console.log('Component mounted');
    fetchReferrals();
  });

  function navigateToWriteReferral() {
    goto('/write-referral');
  }
</script>

<style>
  .referral-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .referral-card {
    font-family: 'Arial';
    padding: 1rem;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  .referral-header {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .referral-info {
    margin-bottom: 0.25rem;
  }

  .error-message {
    color: red;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .cta-button {
    font-family: 'Frutiger', sans-serif;
    font-weight: normal;
    padding: 1rem;
    background-color: #005EB8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 1rem;
    text-align: center;
    width: 10rem;
    
  }

  .cta-button:hover {
    background-color: #0056b3;
  }
</style>

<div class="referral-container">
  <button class="cta-button" on:click={navigateToWriteReferral}>New Referral</button>

  {#if errorMessage}
    <div class="error-message">{errorMessage}</div>
  {/if}

  {#each referrals as referral}
    <div class="referral-card">
      <div class="referral-header">Patient: {referral.patient_name}</div>
      <div class="referral-info"><strong>Referring Clinician:</strong> {referral.referring_clinician_name}</div>
      <div class="referral-info"><strong>Referred To Clinician:</strong> {referral.referred_to_clinician_name}</div>
      <div class="referral-info"><strong>Department:</strong> {referral.referred_to_department}</div>
      <div class="referral-info"><strong>Date:</strong> {new Date(referral.referral_date).toLocaleDateString()}</div>
    </div>
  {/each}
</div>
