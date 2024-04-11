<script>
  import { goto } from '$app/navigation'; 
  export let searchPlaceholder = 'Search...'; 
  import { includeRightButton, showFilters, showReferral, showPrescription, statusFilter } from '../stores.js';
  import { writable } from 'svelte/store';



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
      case 'Tasks':
        goto('/tasks');
        break;
    }
  }

  function setStatusFilter(status) {
    statusFilter.set(status);
    }

  function toggleFilters() {
    showFilters.update(n => !n);
  }

</script>


<style>
  header {
    height: var(--header-height);
    display: flex;
    justify-content: space-between;
   padding-top: 16px;
   padding-left: 16px;
   padding-right: 16px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color:#005EB8;
    z-index: 100;
  }

   .content {
    max-width: 100vw;
    box-sizing: border-box;
    padding-top: calc(var(--header-height) + var(--search-bar-height)); 
    overflow: auto;
  }
  
  .search-bar-container {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    z-index: 90;
    min-height: 50px; 
  }


  @media (max-width: 768px) {
    
    .content {
      padding-top: calc(var(--header-height) + var(--search-bar-height)); 
      
    }

    .search-bar {
  flex-grow: 1; 
  margin-right: 8px;
  }

}

.filter-button {
  flex-shrink: 0;
}

  nav {
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    z-index: 20; 
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

  .filters-dropdown {
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
}

@media (max-width: 768px) {
  .filters-dropdown {
    right: 0;
    left: auto;

  }

}

</style>

<header>
  <button class="icon-button" on:click={() => handleButtonClick('Menu')}>☰</button>
  <button class="logo" on:click={() => handleButtonClick('Home')}>LOGO</button>
  <button class="icon-button" on:click={() => handleButtonClick('Profile')}>👤</button>
</header>

<div class="content">
  <div class="search-bar-container">
    <input class="search-bar" type="text" placeholder={searchPlaceholder} />
    <button class="filter-button" on:click={toggleFilters}>Filters</button>
    {#if $showFilters}
      <div class="filters-dropdown show">
        <!-- Filters content goes here -->
        <label>
          <input type="checkbox" bind:checked={$showReferral}> Referral
        </label>
        <label>
          <input type="checkbox" bind:checked={$showPrescription}> Prescription
        </label>
        <button on:click={() => setStatusFilter('All')}>All</button>
        <button on:click={() => setStatusFilter('✓')}>Completed</button>
        <button on:click={() => setStatusFilter('✕')}>Not Completed</button>
      </div>
    {/if}
  </div>
  <slot></slot>
</div>

<!-- {#if $showFilters}
  <div class="filters-dropdown">
    <label>
      <input type="checkbox" bind:checked={$showReferral}> Referral
    </label>
    <label>
      <input type="checkbox" bind:checked={$showPrescription}> Prescription
    </label>
  </div>
{/if} -->

<!-- <div class="content">
  <div class="search-bar-container">
    <input class="search-bar" type="text" placeholder={searchPlaceholder} />
    <button class="filter-button" on:click={toggleFilters}>Filters</button>
  </div>
  <slot></slot>
</div>

{#if $showFilters}
    <div class="filters-dropdown show">
      <label>
        <input type="checkbox" bind:checked={$showReferral}> Referral
      </label>
      <label>
        <input type="checkbox" bind:checked={$showPrescription}> Prescription
      </label>
      <button on:click={() => setStatusFilter('All')}>All</button>
      <button on:click={() => setStatusFilter('✓')}>Completed</button>
      <button on:click={() => setStatusFilter('✕')}>Not Completed</button>
    </div>
  {/if} -->

<nav>
    <button class="nav-icon" on:click={() => handleButtonClick('Patients')}>PATIENTS</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Appointments')}>APPTS</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Messages')}>MESSAGES</button>
    <button class="nav-icon" on:click={() => handleButtonClick('Tasks')}>TASKS</button>
</nav>