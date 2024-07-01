<script>
  import Button from "../../../components/Button.svelte"; 
  import { goto } from '$app/navigation';

  
  const handleClick = () => {
      alert("Button clicked");
  };

  function navigateTo(page) {
    if (page === 'patients') {
    goto('/clinicianPath/patients');
  } else if (page === 'appointments') {
    goto('/clinicianPath/patient-appointments'); 
  } else if (page === 'messages') {
    goto('/clinicianPath/message-list');
  } else if (page === 'medication') {
    goto('/clinicianPath/medication');
  } else if (page === 'referrals') {
    goto('/clinicianPath/referrals');
  } else if (page === 'tasks') {
    goto('/clinicianPath/tasks');
  }
}
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

.icon-button {
  width: 8vh;
  height: 8vh;
}

.icon-round {
    position: fixed;
    bottom: 64px; 
    right: 20px; 
    z-index: 30; 
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    background-color: #fff; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }


:root {
  --header-height: 10vh;
  --nav-bar-height: 10vh;
  --icon-round-size: 10vh; 
  --icon-round-margin: 5vw; 
  --icon-round-total: calc(var(--icon-round-size) + var(--icon-round-margin)); 
}


</style>

<div class="app-container">

  <div class="middle-buttons">
    <Button text="TASKS" action={() => navigateTo('tasks')} />
      <Button text="APPOINTMENTS" action={() => navigateTo('appointments')} />
      <Button text="MESSAGES" action={() => navigateTo('messages')} />
      <Button text="MEDICATION" action={() => navigateTo('medication')} />
      <Button text="REFERRALS" action={() => navigateTo('referrals')} />
      <Button text="PATIENTS" action={() => navigateTo('patients')} />
  </div>

  <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>

</div>
