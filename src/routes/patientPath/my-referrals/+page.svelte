<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '../../../supabaseClient';
  
    interface Referral {
      referral_id: string;
      referring_clinician_id: string;
      referred_to_clinician_id: string;
      referred_to_department: string;
      referral_date: string;
      referring_clinician_name?: string;
      referred_to_clinician_name?: string;
    }
  
    interface Clinician {
      clinician_id: string;
      first_name: string;
      last_name: string;
    }
  
    let referrals: Referral[] = [];
    let errorMessage: string = '';
  
    async function fetchReferrals() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
  
        if (sessionData && sessionData.session) {
          const patientId: string = sessionData.session.user.id;
  
          const { data: referralsData, error: referralsError } = await supabase
            .from('referrals')
            .select('referral_id, referring_clinician_id, referred_to_clinician_id, referred_to_department, referral_date')
            .eq('patient_id', patientId)
            .order('referral_date', { ascending: false });
  
          if (referralsError) throw referralsError;
  
          referrals = await Promise.all(referralsData.map(async (referral: Referral) => {
            const { data: referringClinician, error: referringClinicianError } = await supabase
              .from('clinicians')
              .select('first_name, last_name')
              .eq('clinician_id', referral.referring_clinician_id)
              .single();
  
            if (referringClinicianError) throw referringClinicianError;
  
            const { data: referredToClinician, error: referredToClinicianError } = await supabase
              .from('clinicians')
              .select('first_name, last_name')
              .eq('clinician_id', referral.referred_to_clinician_id)
              .single();
  
            if (referredToClinicianError) throw referredToClinicianError;
  
            return {
              ...referral,
              referring_clinician_name: `${referringClinician.first_name} ${referringClinician.last_name}`,
              referred_to_clinician_name: `${referredToClinician.first_name} ${referredToClinician.last_name}`
            };
          }));
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
        errorMessage = error.message;
      }
    }
  
    onMount(() => {
      fetchReferrals();
    });
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
  
    .referral-card {
      background-color: #fff;
      padding: 16px;
      margin-bottom: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    .referral-info {
      margin-bottom: 8px;
    }
  
    .error-message {
      color: red;
      margin-bottom: 16px;
    }
  </style>
  
  <div class="container">
    <div class="header">My Referrals</div>
    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}
    {#each referrals as referral}
      <div class="referral-card">
        <div class="referral-info"><strong>Referring Clinician:</strong> {referral.referring_clinician_name}</div>
        <div class="referral-info"><strong>Referred to Clinician:</strong> {referral.referred_to_clinician_name}</div>
        <div class="referral-info"><strong>Department:</strong> {referral.referred_to_department}</div>
        <div class="referral-info"><strong>Referral Date:</strong> {new Date(referral.referral_date).toLocaleDateString('en-GB')}</div>
      </div>
    {/each}
  </div>
  