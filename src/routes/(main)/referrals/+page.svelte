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
  .referral-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .referral-card {
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
</style>

<div class="referral-container">
  {#if errorMessage}
    <div class="error-message">{errorMessage}</div>
  {/if}

  {#each referrals as referral}
    <div class="referral-card">
      <div class="referral-header">Referral ID: {referral.referral_id}</div>
      <div class="referral-info"><strong>Referring Clinician:</strong> {referral.referring_clinician_name}</div>
      <div class="referral-info"><strong>Referred To Clinician:</strong> {referral.referred_to_clinician_name}</div>
      <div class="referral-info"><strong>Department:</strong> {referral.referred_to_department}</div>
      <div class="referral-info"><strong>Date:</strong> {new Date(referral.referral_date).toLocaleDateString()}</div>
    </div>
  {/each}
</div>
