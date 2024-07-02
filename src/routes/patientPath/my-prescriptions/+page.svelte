<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '../../../supabaseClient';
  
  let shortTermCount = 0;
  let longTermCount = 0;
  let user = null;

  const navigateTo = (page) => {
    if (page === 'acute') {
      goto('/patientPath/acute-prescriptions');
    } else if (page === 'repeat') {
      goto('/patientPath/repeat-prescriptions');
    }
  };

  onMount(async () => {
    const { data: { user: fetchedUser }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    user = fetchedUser;

    if (user) {
      const { data: prescriptions, error: fetchError } = await supabase
        .from('prescriptions')
        .select('prescription_term')
        .eq('patient_id', user.id);

      if (fetchError) {
        console.error('Error fetching prescriptions:', fetchError);
        return;
      }

      shortTermCount = prescriptions.filter(p => p.prescription_term === 'short_term').length;
      longTermCount = prescriptions.filter(p => p.prescription_term === 'long_term').length;
    }
  });
</script>

<style>
  .container {
    max-width: 600px;
    margin: auto;
    padding: 16px;
    font-family: Arial, sans-serif;
  }

  .header {
    font-family: 'Frutiger', sans-serif;
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 16px;
    text-align: center;
  }

  .cta-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    padding: 16px;
    margin-bottom: 8px;
    background-color: #005EB8;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Frutiger', sans-serif;
  }

  .cta-item:hover {
    background-color: #004494;
  }

  .cta-text {
    font-weight: bold;
  }

  .cta-arrow {
    font-size: 24px;
  }

  @media (max-width: 600px) {
    .container {
      padding: 8px;
    }

    .cta-item {
      padding: 12px;
    }
  }
</style>

<div class="container">
  <div class="header">My Prescriptions</div>
  <div class="cta-item" on:click={() => navigateTo('acute')}>
    <div class="cta-text">Acute (short-term) medicines</div>
    <div class="cta-arrow">{shortTermCount} ➔</div>
  </div>
  <div class="cta-item" on:click={() => navigateTo('repeat')}>
    <div class="cta-text">Repeat medicines</div>
    <div class="cta-arrow">{longTermCount} ➔</div>
  </div>
</div>
