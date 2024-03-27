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
  align-items: center;
  width: 360px;
  height: 800px;
  margin: auto;
  background-color: #fff;
  padding: 16px;
  box-sizing: border-box;
}


@media (max-width: 768px) { /* Mobile view media query */
    .app-container {
      width: 100%;
      margin: 0; /* Updated to remove margin for mobile view */
      padding: 16px;
    }

    .search-bar {
      width: 100%; /* Search bar takes full width within .app-container */
      margin: 16px 0; /* Adjusting the margin for mobile */
    }

.middle-buttons {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
}

.button {
  background-color: #c0c0c0;
  border: none;
  padding: 12px;
  width: 100%;
  text-align: center;
  border-radius: 4px;
  font-size: 16px;
}

.icon-button {
  width: 48px;
  height: 48px;
}

.icon-round {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin-top: 32px;
}

}

</style>

<div class="app-container">

<div class="middle-buttons">
  <button class="button" on:click={() => handleButtonClick('Patients')}>PATIENTS</button>
  <button class="button" on:click={() => handleButtonClick('Appointments')}>APPOINTMENTS</button>
  <button class="button" on:click={() => handleButtonClick('Referrals')}>REFERRALS</button>
  <button class="button" on:click={() => handleButtonClick('Prescriptions')}>PRESCRIPTIONS</button>
  <button class="button" on:click={() => handleButtonClick('Messages')}>MESSAGES</button>
  <button class="button" on:click={() => handleButtonClick('Tasks')}>TASKS</button>
</div>

<div class="middle-buttons">
    <button class="button" on:click={() => handleButtonClick('Patients')}>PATIENTS</button>
    <!-- ... other buttons ... -->
</div>

<button class="icon-button icon-round" on:click={() => handleButtonClick('Notes')}>!</button>

</div>
