<!-- layout.svelte -->
<script>
  import { goto } from '$app/navigation';

  function handleButtonClick(action) {
    switch(action) {
      case 'Patients':
        goto('/patients');
        break;
      case 'Appointments':
        goto('/patientAppointments');
        break;
      case 'Messages':
        goto('/messageList');
        break;

    }
  }
</script>


<style>
  header {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    position: fixed; /* Fixed to the top */
    top: 0;
    left: 0;
    right: 0;
    background-color:#005EB8;
    z-index: 100; /* Ensures the header is above other content */
  }

   .content {
    /* Add padding-top equivalent to the height of the header plus search bar container */
    padding-top: 120px; /* This is an example value; you need to adjust it based on your header's actual height */
  }
  
  .search-bar-container {
    width: 100%;
    padding-left: 0px;
    padding-right:0px;
    padding-top: 16px; /* Height of the header */
    box-sizing: border-box;
    position: fixed;
    top: 60px; /* Place it right below the header */
    left: 0;
    right: 0;
    z-index: 90; /* Below the header z-index */
    background-color: white;
  }

  @media (max-width: 768px) {
    /* Ensure the content of the page does not get hidden under the nav or header */
    .content {
      padding-top: 120px; /* Adjust this value based on the total height of your fixed header and search bar */
      padding-bottom: 70px; /* Adjust this value based on the height of your nav */
    }

  .search-bar {
    height: 48px;
    width: 100%; /* Full width */
    margin: 0 auto; /* Center the search bar if needed */
    box-sizing: border-box; /* Include padding in the width */
    border: 2px solid #005EB8;
  }

  nav {
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    z-index: 20; /* Ensure it's above the content but below floating buttons */
  }

  .icon-button {
    width: 48px;
    height: 48px;
    background-color: #005EB8;
    color: white;
    border: 0;
    font-size: 24px;
  }

  .logo {
    justify-content: center;
    text-align: center;
    padding-top: 5%;
  }

  .nav-icon {
    width: 48px; /* Adjust size for a square button */
    height: 48px; /* Same as width for square */
    flex-grow: 1; /* This will make all buttons grow to fill the nav equally */
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    background-color: #005EB8;
    border-color: #0072CE
  }

  @media (max-width: 768px) {
    nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: white; /* Or any color fitting your design */
    }

    /* Ensure the content of the page does not get hidden under the nav */
    .content {
      padding-bottom: 70px; /* Adjust based on the height of your nav */
    }

  }

}
</style>

<header>
  <button class="icon-button" on:click={() => handleButtonClick('Menu')}>☰</button>
  <div class="logo">LOGO</div>
  <button class="icon-button" on:click={() => handleButtonClick('Profile')}>👤</button>
</header>

<div class="search-bar-container">
  <input class="search-bar" type="text" placeholder="SEARCH BAR..."/>
</div>

<!-- Use the .content class to provide spacing for the fixed header and search bar -->
<div class="content">
  <slot></slot>
</div>


<nav>
    <button class="nav-icon" on:click={() => handleButtonClick('Patients')}>PATIENTS</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Appointments')}>APPTS</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Messages')}>MESSAGES</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Tasks')}>TASKS</button>
</nav>