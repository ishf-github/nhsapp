<!-- src/routes/+page.svelte -->

<script>
  import Button from "../components/Button.svelte";
  import { goto } from '$app/navigation';
  
  const handleClick = () => {
      alert("Button clicked");
  };

  // Remove the TypeScript types to use plain JavaScript
  function navigateTo(page) {
    if (page === 'patients') {
    goto('/patients');
  } else if (page === 'appointments') {
    goto('/patientAppointments'); // Ensure this is the correct route
  } else if (page === 'messages') {
    goto('/messageList');
  } else if (page === 'prescriptions') {
    goto('/prescriptions');
  } else if (page === 'referrals') {
    goto('/referrals');
  } else if (page === 'tasks') {
    goto('/tasks');
  }
}
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* This will distribute space evenly */
  align-items: center;
  width: 100%;
  height: calc(100vh - var(--header-height) - var(--search-bar-height) - var(--nav-bar-height));
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  position: relative; /* This is new, ensures the icon-round is positioned relative to app-container */
  padding-bottom: 100px;
}

@media (max-width: 768px) { /* Mobile view media query */
    .app-container {
      width: 100%;
      margin: 0; /* Updated to remove margin for mobile view */
      padding: 16px;
    }


    .middle-buttons {
    display: flex;
    flex-direction: column;
    justify-content: space-around; /* Distributes space evenly */
    width: 100%;
    height: 100%; /* Takes full height available */
    padding: 16px 0; /* Add padding at the top and bottom if needed */
  }

  .button {
    border: none;
    padding: 12px 20px;
    width: calc(100% - 40px);
    text-align: left;
    border-radius: 0;
    font-size: 16px;
    background-color: transparent;
    color: #000;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

.icon-button {
  width: 48px;
  height: 48px;
}

.icon-round {
    position: fixed;
    bottom: 64px; /* Distance from bottom, adjust as needed */
    right: 20px; /* Distance from right, adjust as needed */
    z-index: 30; /* Higher than nav's z-index to ensure visibility */
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    background-color: #fff; /* Or any desired background color */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }


:root {
  --header-height: 60px;
  --nav-bar-height: 60px;
  --icon-round-size: 64px; /* Size of the round button */
  --icon-round-margin: 20px; /* Margin from the bottom for the round button */
  --icon-round-total: calc(var(--icon-round-size) + var(--icon-round-margin)); /* Total space the round button occupies */
}
}

</style>

<div class="app-container">

  <div class="middle-buttons">
    <Button text="TASKS →" action={() => navigateTo('tasks')} />
      <Button text="APPOINTMENTS →" action={() => navigateTo('appointments')} />
      <Button text="MESSAGES →" action={() => navigateTo('messages')} />
      <Button text="PRESCRIPTIONS →" action={() => navigateTo('prescriptions')} />
      <Button text="REFERRALS →" action={() => navigateTo('referrals')} />
      <Button text="PATIENTS →" action={() => navigateTo('patients')} />
  </div>

  <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>

</div>
