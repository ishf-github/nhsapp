<script>
  import Button from "../components/Button.svelte";
  import { goto } from '$app/navigation';
  
  const handleClick = () => {
      alert("Button clicked");
  };

  // Remove the TypeScript types to use plain JavaScript
  function handleButtonClick(button) {
    if (button === 'Patients') {
      goto('/patients'); // Navigate to the patients route
    }
  }
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly; /* This will distribute space evenly */
  align-items: center;
  width: 100%;
  height: calc(100vh - var(--header-height) - var(--nav-bar-height)); /* Adjust --header-height and --nav-bar-height in :root if necessary */
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

    .search-bar {
      width: 100%; /* Search bar takes full width within .app-container */
      margin: 60px; /* Adjusting the margin for mobile */
    }

 

    .middle-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

  .button {
    border: none;
    padding: 12px 20px; /* Padding inside the button */
    width: calc(100% - 40px); /* Full width minus padding */
    text-align: left;
    border-radius: 0; /* No rounded corners */
    font-size: 16px;
    background-color: transparent;
    color: #000; /* Text color - assuming black */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Align arrow to the right */
    margin-bottom: 16px; 
  }

  .button::after {
    content: '→'; /* Arrow */
    font-size: 24px;
    margin-left: auto;
  }

.icon-button {
  width: 48px;
  height: 48px;
}

.icon-round {
    position: fixed;
    bottom: 20px; /* Distance from bottom, adjust as needed */
    right: 20px; /* Distance from right, adjust as needed */
    z-index: 30; /* Higher than nav's z-index to ensure visibility */
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    background-color: #fff; /* Or any desired background color */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
.icon-round-container {
  position: fixed;
  bottom: 20px; /* Distance from bottom, adjust as needed */
  right: 20px; /* Distance from right, adjust as needed */
  z-index: 20; /* Higher than nav's z-index to ensure visibility */
  width: var(--icon-round-size); /* Width of the round button */
  height: var(--icon-round-size); /* Height of the round button */
  display: flex; /* For centering the icon inside the button */
  align-items: center; /* Center align */
  justify-content: center; /* Center justify */
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
    <button class="button" on:click={() => navigateTo('tasks')}>TASKS</button>
    <button class="button" on:click={() => navigateTo('appointments')}>APPOINTMENTS</button>
    <button class="button" on:click={() => navigateTo('messages')}>MESSAGES</button>
    <button class="button" on:click={() => navigateTo('prescriptions')}>PRESCRIPTIONS</button>
    <button class="button" on:click={() => navigateTo('referrals')}>REFERRALS</button>
    <button class="button" on:click={() => navigateTo('patients')}>PATIENTS</button>
  </div>

  <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>Notes</button>

</div>
