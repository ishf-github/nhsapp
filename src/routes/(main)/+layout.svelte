<script>
  import { goto } from '$app/navigation'; 
  export let searchPlaceholder = 'Search...'; 
  import { includeRightButton, showFilters, showReferral, showPrescription, statusFilter } from '../../stores.js';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';


  let showDropdown = false;

  const showSideNav = writable(false);

  function handleButtonClick(action) {
    switch(action) {
      case 'Home': goto('/'); break;
      case 'Patients': goto('/patients'); break;
      case 'Appointments': goto('/patient-appointments'); break;
      case 'Messages': goto('/message-list'); break;
      case 'Tasks': goto('/tasks'); break;
      case 'Referrals': goto('/referrals'); break;
      case 'Prescriptions': goto('/prescriptions'); break;
      case 'SignOut': goto('/clinician-signin'); break;
    }
    showDropdown = false;
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function navigateTo(route) {
    showDropdown = false; 
    goto(route);
  }

  function closeDropdown() {
    if (showDropdown) {
      showDropdown = false;
    }
  }

  onMount(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.dropdown-menu') && !event.target.closest('.menu-button')) {
        showDropdown = false;
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  });

  

  function handleKeydown(event, action) {
    if (event.key === 'Enter') {
        handleButtonClick(action);
    }
  }


  function setStatusFilter(status) {
    statusFilter.set(status);
  }

  function toggleFilters() {
    showFilters.update(n => !n);
  }

  function navigateHome() {
    goto('/');
  }

</script>


<style>

.dropdown-menu {
  position: absolute;
  top: var(--header-height);
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.25);
  z-index: 200;
  display: none;
}

  
  .dropdown-menu.show {
    display: block;
  }
  
  .dropdown-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
  }
  .dropdown-item:last-child {
    border-bottom: none;
  }
  .dropdown-item:hover {
    background-color: #f0f0f0;
  }

  :root {
    --header-height: 60px;
    --nav-bar-height: 60px;
    --nav-bar-width: 250px;
  }
  
  header {
  height: var(--header-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #005EB8;
  z-index: 100;
}

  .content {
  padding-top: calc(var(--header-height) + 20px);
  max-width: 100vw;
  overflow: auto;
  transition: padding-left 0.3s;
}


  @media (max-width: 768px) {
  .content {
    padding-top: calc(var(--header-height) + 10px);
  }


  .search-bar {
  flex-grow: 1;
  padding: 8px 16px;
  border: 2px solid #ccc; 
  margin-right: 8px;
  display: block;
  }

}

/* .filter-button {
  flex-shrink: 0;
} */

  nav {
    display: flex;
  }

  @media (max-width: 768px) {
    nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    z-index: 20; 
  }
}

.icon-button {
  width: 48px;
  height: 48px;
  background-color: #005EB8;
  color: white;
  border: none;
  font-size: 24px;
}

@media (max-width: 768px) {
  
}

  .logo {
  display: flex;
  align-items: center;
  margin-right: 20px; 
}

  .nav-icon {
    width: 48px; 
    height: 48px; 
    flex-grow: 1; 
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
      background-color: white; 
    }

    .content {
      padding-top: calc(var(--header-height) + var(--search-bar-height)); 
    }

  }

  :root {
    --header-height: 60px; 
    --search-bar-height: 60px; 
    --nav-bar-height: 60px; 
  }

  /* .filters-dropdown {
    position: absolute;
    top: 100%; 
    left: 0;
    right: 0; 
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    padding: 10px;
    z-index: 200;
    display: none;
    max-width: calc(100% - 32px);
    overflow-x: auto;
  }

.filters-dropdown.show {
  display: block;
}

.filters-dropdown label,
.filters-dropdown button {
  display: block;
  margin-bottom: 8px;
} */

/* @media (max-width: 768px) {
  .filters-dropdown {
    right: 0;
    left: auto;
  }

} */

.search-bar {
  flex-grow: 1;
  padding: 8px 16px;
  border: 2px solid #ccc;
  margin-right: 20px;
}

.side-nav {
    display: none;
    position: fixed;
    top: var(--header-height);
    bottom: 0;
    left: 0;
    width: var(--nav-bar-width);
    background-color: #fff;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 10;
    padding-top: 1rem;
}

@media (min-width: 769px) {
  nav {
      display: none;
    }

  .side-nav {
  display: block;
  position: fixed;
  top: var(--header-height);
  bottom: 0;
  left: 0;
  width: var(--nav-bar-width);
  background-color: fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding-top: 2rem;
}

.side-nav button {
  background-color: #005EB8;
  color: white;
  padding: 1rem;
  text-align: center;
  border: none;
  width: 100%;
}

  .side-nav nav,
.side-nav button {
  display: block;
}

.side-nav button:hover {
  background-color: #f5f5f5;
  color: #333;
}

  @media (min-width: 769px) {
    .content {
      padding-left: var(--nav-bar-width);
    }
    
    .side-nav {
      display: block; 
    }

    
    .sign-out-button {
      display: block;
      background-color: #005EB8;
      color: white;
      padding: 1rem;
      text-align: center;
      border: none;
      margin-top: auto;
      width: 100%;
      border-top: 1px solid #eee;
    }
  }
  @media (min-width: 769px) {
    .sign-out-button {
      display: block;
    }
  }
}

  .logo img {
    max-height: 5rem;
  width: auto;
  padding-left: 1rem;
  padding-right: 1rem; 
  }


</style>

<aside class="side-nav">
  <nav>
    <button on:click={() => handleButtonClick('Patients')}>PATIENTS</button>
    <button on:click={() => handleButtonClick('Appointments')}>APPOINTMENTS</button>
    <button on:click={() => handleButtonClick('Messages')}>MESSAGES</button>
    <button on:click={() => handleButtonClick('Tasks')}>TASKS</button>
  </nav>
  <button class="sign-out-button" on:click={() => handleButtonClick('SignOut')}>SIGN OUT</button>
</aside>

<header>
  <button class="icon-button menu-button" on:click={toggleDropdown}>☰</button>
  <ul class="dropdown-menu" class:show={showDropdown}>
    <li class="dropdown-item" on:click={() => navigateTo('/')}>Home</li>
    <li class="dropdown-item" on:click={() => navigateTo('/patients')}>Patients</li>
    <li class="dropdown-item" on:click={() => navigateTo('/patient-appointments')}>Appointments</li>
    <li class="dropdown-item" on:click={() => navigateTo('/referrals')}>Referrals</li>
    <li class="dropdown-item" on:click={() => navigateTo('/prescriptions')}>Prescriptions</li>
    <li class="dropdown-item" on:click={() => navigateTo('/message-list')}>Messages</li>
    <li class="dropdown-item" on:click={() => navigateTo('/tasks')}>Tasks</li>
    <li class="dropdown-item" on:click={() => navigateTo('/clinician-signin')}>Sign Out</li>
  </ul>
  <div class="logo" role="button" tabindex="0" on:click={navigateHome} on:keydown={(event) => handleKeydown(event, 'Home')}>
    <img src="src/myNHS Logo.png" alt="Logo">
  </div>
  <input class="search-bar" type="text" placeholder={searchPlaceholder} />
  <button class="icon-button" on:click={() => handleButtonClick('Profile')} on:keydown={(event) => handleKeydown(event, 'Profile')}>👤</button>
</header>

<div class="content">
  <slot></slot>
</div>

<nav>
    <button class="nav-icon" on:click={() => handleButtonClick('Patients')}>PATIENTS</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Appointments')}>APPTS</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Messages')}>MESSAGES</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Tasks')}>TASKS</button>
</nav>