<script>
  import Button from "../../../components/Button.svelte"; 
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';
  let user = null;
  let userData = null;
  
  const handleClick = () => {
    alert("Button clicked");
  };

  function navigateTo(page) {
    if (page === 'gpRecord') {
      goto('/patientPath/gp-record');
    } else if (page === 'myAppointments') {
      goto('/patientPath/my-appointments'); 
    } else if (page === 'myPrescriptions') {
      goto('/patientPath/my-prescriptions');
    } else if (page === 'myMessages') {
      goto('/patientPath/my-inbox');
    }
  }

  onMount(async () => {
    const { data: { user: fetchedUser }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }

    user = fetchedUser;

    if (user) {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', user.id)
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
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    width: 100%;
    height: calc(100vh - var(--header-height) - var(--search-bar-height) - var(--nav-bar-height));
    overflow-y: auto;
    padding: 16px;
    box-sizing: border-box;
    position: relative; 
    padding-bottom: 100px;
  }

  @media (max-width: 768px) { 
    .app-container {
      width: 100%;
      margin: 0; 
      padding: 4%;
    }

    .middle-buttons {
      display: flex;
      flex-direction: column;
      justify-content: space-around; 
      width: 100%;
      height: 100%; 
      padding: 4% 0; 
    }
  }

  @media (min-width: 769px) {
    .app-container {
      width: 100%;
      margin: 0; 
      padding: 4%;
    }

    .middle-buttons {
      display: flex;
      flex-direction: column;
      justify-content: space-around; 
      width: 100%;
      height: 100%; 
      padding: 4% 0; 
    }
  }

  :root {
    --header-height: 10vh;
    --nav-bar-height: 10vh;
  }
</style>

<div class="app-container">
  {#if user}
    <p>Welcome, {user.email}!</p>
    {#if userData}
      <div class="middle-buttons">
        <Button text="MY GP RECORD" action={() => navigateTo('gpRecord')} />
        <Button text="APPOINTMENTS" action={() => navigateTo('myAppointments')} />
        <Button text="PRESCRIPTIONS" action={() => navigateTo('myPrescriptions')} />
        <Button text="MESSAGES" action={() => navigateTo('myMessages')} />
      </div>
    {:else}
      <p>Loading your data...</p>
    {/if}
  {:else}
    <p>Please log in to view your information.</p>
  {/if}
</div>
