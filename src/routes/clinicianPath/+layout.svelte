<script>
  import { goto } from '$app/navigation'; 
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  let showDropdown = false;

  const showSideNav = writable(false);

  function handleButtonClick(action) {
    switch(action) {
      case 'Home': goto('clinicianPath/clinician-home'); break;
      case 'Patients': goto('/clinicianPath/patients'); break;
      case 'Appointments': goto('/clinicianPath/patient-appointments'); break;
      case 'Messages': goto('/clinicianPath/message-list'); break;
      case 'Referrals': goto('/clinicianPath/referrals'); break;
      case 'Prescriptions': goto('/clinicianPath/prescriptions'); break;
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

  function navigateHome() {
    goto('/clinicianPath/clinician-home');
  }
</script>

<style>
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
  }

  .dropdown-menu {
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    background-color: #005EB8;
    color: white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.25);
    z-index: 200;
    display: none;
    font-family: 'Frutiger', sans-serif;
    text-align: center;
    width: 100%;
    font-size: 1.1rem;
  }

  @media (min-width: 769px) {
    .dropdown-menu {
      width: 20%;
    }
  }

  .dropdown-menu.show {
    display: block;
  }

  .dropdown-item {
    padding: 10px;
    cursor: pointer;
    list-style: none;
    border-bottom: none;
    text-transform: capitalize;
  }

  .dropdown-item:hover {
    background-color: #004080;
  }

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
    position: absolute;
    left: 16px;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90%;
    margin: auto;
  }

  .logo img {
    max-height: 100%;
    width: auto;
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
    border-color: #0072CE;
    font-family: 'Frutiger', sans-serif;
    font-weight: bold;
    text-transform: capitalize;
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
      background-color: #fff;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      z-index: 10;
      /* padding-top: 1rem; */
    }

    .side-nav button {
      background-color: #005EB8;
      color: white;
      padding: 1rem;
      text-align: center;
      border: none;
      width: 100%;
      font-family: 'Frutiger', sans-serif;
      font-weight: bold;
      text-transform: capitalize;
    }

    .side-nav nav,
    .side-nav button {
      display: block;
    }

    .side-nav button:hover {
      background-color: #f5f5f5;
      color: #333;
    }

    .content {
      padding-left: var(--nav-bar-width);
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
      font-family: 'Frutiger', sans-serif;
      font-weight: bold;
      text-transform: capitalize;
    }

    .sign-out-button:hover {
      background-color: #f5f5f5;
      color: #333;
    }
  }

  .logo img {
    max-height: 90%;
    width: auto;
    padding-left: 1rem;
    padding-right: 1rem; 
  }
</style>

<aside class="side-nav">
  <nav>
    <button on:click={() => handleButtonClick('Patients')}>Patients</button>
    <button on:click={() => handleButtonClick('Appointments')}>Appointments</button>
    <button on:click={() => handleButtonClick('Messages')}>Messages</button>
    <button on:click={() => handleButtonClick('Prescriptions')}>Prescriptions</button>
    <button on:click={() => handleButtonClick('Referrals')}>Referrals</button>
  </nav>
  <button class="sign-out-button" on:click={() => handleButtonClick('SignOut')}>Sign Out</button>
</aside>

<header>
  <button class="icon-button menu-button" on:click={toggleDropdown}>☰</button>
  <div class="logo" role="button" tabindex="0" on:click={navigateHome} on:keydown={(event) => handleKeydown(event, 'Home')}>
    <img src="..\src\myNHS Logo.png" alt="Logo">
  </div>
  <ul class="dropdown-menu" class:show={showDropdown}>
    <li class="dropdown-item" on:click={() => navigateTo('/clinicianPath/clinician-home')}>Home</li>
    <li class="dropdown-item" on:click={() => navigateTo('/clinicianPath/patients')}>Patients</li>
    <li class="dropdown-item" on:click={() => navigateTo('/clinicianPath/patient-appointments')}>Appointments</li>
    <li class="dropdown-item" on:click={() => navigateTo('/clinicianPath/referrals')}>Referrals</li>
    <li class="dropdown-item" on:click={() => navigateTo('/clinicianPath/prescriptions')}>Prescriptions</li>
    <li class="dropdown-item" on:click={() => navigateTo('/clinicianPath/message-list')}>Messages</li>
    <li class="dropdown-item" on:click={() => navigateTo('/clinician-signin')}>Sign Out</li>
  </ul>
</header>

<div class="content">
  <slot></slot>
</div>

<nav>
  <button class="nav-icon" on:click={() => handleButtonClick('Patients')}>Patients</button>
  <button class="nav-icon" on:click={() => handleButtonClick('Appointments')}>Appointments</button>
  <button class="nav-icon" on:click={() => handleButtonClick('Messages')}>Messages</button>
  <button class="nav-icon" on:click={() => handleButtonClick('Prescriptions')}>Prescriptions</button>
</nav>