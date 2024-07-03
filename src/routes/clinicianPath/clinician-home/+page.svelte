<script>
  import Button from "../../../components/Button.svelte";
  import { goto } from '$app/navigation'; 
  import { onMount } from 'svelte'; 
  import { supabase } from '../../../supabaseClient';


  let user = null;
  let userData = null;

  // Navigation
  function navigateTo(page) {
    if (page === 'patients') {
      goto('/clinicianPath/patients');
    } else if (page === 'appointments') {
      goto('/clinicianPath/patient-appointments'); 
    } else if (page === 'messages') {
      goto('/clinicianPath/message-list');
    } else if (page === 'prescriptions') {
      goto('/clinicianPath/prescriptions');
    } else if (page === 'referrals') {
      goto('/clinicianPath/referrals');
    } else if (page === 'tasks') {
      goto('/clinicianPath/tasks');
    }
  }

  // Fetch user information when component mounts
  onMount(async () => {
    const { data: { user: fetchedUser }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }

    user = fetchedUser;

    if (user) {
      const { data, error } = await supabase
        .from('clinicians')
        .select('*')
        .eq('clinician_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        userData = data;
      }
    }
  });
</script>

<style>
  .app-container {
    font-family: 'Frutiger', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: calc(100vh - var(--header-height) - var(--search-bar-height) - var(--nav-bar-height));
    overflow-y: auto;
    padding: 16px;
    box-sizing: border-box;
    position: relative; 
    padding-bottom: 100px;
  }

  .welcome-message {
    margin-bottom: 2rem;
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
  }

  .middle-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .button-spacing {
    margin: 1rem 0;
  }

  @media (max-width: 768px) { 
    .app-container {
      width: 100%;
      padding: 4%;
    }
  }

  @media (min-width: 769px) {
    .app-container {
      width: 100%;
      padding: 4%;
    }
  }

  :root {
    --header-height: 10vh;
    --nav-bar-height: 10vh;
  }

</style>

<div class="app-container">
  {#if user}
    <p class="welcome-message">{userData ? `${userData.first_name} ${userData.last_name}` : 'Loading...'}</p>
    {#if userData}
      <div class="middle-buttons">
        <div class="button-spacing">
          <Button text="Appointments" action={() => navigateTo('appointments')} />
        </div>
        <div class="button-spacing">
          <Button text="Messages" action={() => navigateTo('messages')} />
        </div>
        <div class="button-spacing">
          <Button text="Prescriptions" action={() => navigateTo('prescriptions')} />
        </div>
        <div class="button-spacing">
          <Button text="Referrals" action={() => navigateTo('referrals')} />
        </div>
        <div class="button-spacing">
          <Button text="Patients" action={() => navigateTo('patients')} />
        </div>
      </div>
    {:else}
      <p>Loading your data...</p>
    {/if}
  {:else}
    <p>Please log in to view your information.</p>
  {/if}
</div>
