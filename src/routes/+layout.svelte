<!-- layout.svelte -->
<script>
    // Import statements if you have any components for logo, buttons, etc.

    function handleButtonClick(button) {
    console.log(`${button} clicked`);
    }
    
</script>

<style>
  header {
    display: flex;
    justify-content: space-between;
    padding: 16px;
  }

  nav {
    display: flex;
    justify-content: space-around;
    padding: 16px;
  }

  .icon-button {
    width: 48px;
    height: 48px;
  }

  .logo {
    /* Styling for the logo */
  }

  .nav-icon {
    width: 48px;
    height: 48px;
  }
</style>

<header>
    <button class="icon-button" on:click={() => handleButtonClick('Menu')}>☰</button>
    <div class="logo">LOGO</div>
    <button class="icon-button" on:click={() => handleButtonClick('Profile')}>👤</button>
</header>
<slot></slot>
<nav>
    <button class="nav-icon" on:click={() => handleButtonClick('Patients')}>PATIENTS</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Appointments')}>APPOINTMENTS</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Messages')}>MESSAGES</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Alerts')}>!</button>
</nav>