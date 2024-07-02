<script>
  import { goto } from '$app/navigation'; 
  export let searchPlaceholder = 'Search...'; 
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  let showDropdown = false;

  const showSideNav = writable(false);

  function handleButtonClick(action) {
    switch(action) {
      case 'Home': goto('/'); break;
      case 'gpRecord': goto('/patientPath/gp-record'); break;
      case 'myAppointments': goto('/patientPath/my-appointments'); break;
      case 'myPrescriptions': goto('/patientPath/my-prescriptions'); break;
      case 'myMessages': goto('/patientPath/my-inbox'); break;
      case 'SignOut': goto('/patient-signin'); break;
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
    goto('/patientPath/patient-home');
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

  .icon-button {
    width: 48px;
    height: 48px;
    background-color: #005EB8;
    color: white;
    border: none;
    font-size: 24px;
  }

  .dropdown-menu {
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    background-color: #005EB8;
    color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
    z-index: 200;
    display: none;
    font-family: 'Frutiger', sans-serif;
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
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
  }

  .dropdown-item:hover {
    background-color: #004080;
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
      background-color: rgb(206, 202, 195);
      z-index: 20; 
    }
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
    background-color: #2D3A42;
    border: none;
    font-family: 'Frutiger', sans-serif;
    text-transform: capitalize;
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
    padding-top: 0;
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
      padding-top: 0;
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
</style>

<aside class="side-nav">
  <nav>
    <button on:click={() => handleButtonClick('gpRecord')}>My GP Record</button>
    <button on:click={() => handleButtonClick('myAppointments')}>Appointments</button>
    <button on:click={() => handleButtonClick('myPrescriptions')}>Prescriptions</button>
    <button on:click={() => handleButtonClick('myMessages')}>Messages</button>
  </nav>
  <button class="sign-out-button" on:click={() => handleButtonClick('SignOut')}>Sign Out</button>
</aside>

<header>
  <button class="icon-button menu-button" on:click={toggleDropdown}>☰</button>
  <ul class="dropdown-menu" class:show={showDropdown}>
    <li class="dropdown-item" on:click={() => navigateTo('/patientPath/patient-home')}>Home</li>
    <li class="dropdown-item" on:click={() => navigateTo('/patientPath/gp-record')}>My GP Record</li>
    <li class="dropdown-item" on:click={() => navigateTo('/patientPath/my-appointments')}>Appointments</li>
    <li class="dropdown-item" on:click={() => navigateTo('/patientPath/my-prescriptions')}>Prescriptions</li>
    <li class="dropdown-item" on:click={() => navigateTo('/patientPath/my-inbox')}>Messages</li>
    <li class="dropdown-item" on:click={() => navigateTo('/patient-signin')}>Sign Out</li>
  </ul>
  <div class="logo" role="button" tabindex="0" on:click={navigateHome} on:keydown={(event) => handleKeydown(event, 'Home')}>
    <img src="..\src\myNHS Logo.png" alt="Logo">
  </div>
</header>

<div class="content">
  <slot></slot>
</div>
  
  <nav>
      <button class="nav-icon" on:click={() => handleButtonClick('gpRecord')}>GP Record</button>
      <button class="nav-icon" on:click={() => handleButtonClick('myAppointments')}>Appts</button>
      <button class="nav-icon" on:click={() => handleButtonClick('myPrescriptions')}>Prescriptions</button>
      <button class="nav-icon" on:click={() => handleButtonClick('myMessages')}>Messages</button>
  </nav>
