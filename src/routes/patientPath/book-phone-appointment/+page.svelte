<script>
  import { writable } from 'svelte/store';
  import { supabase } from '../../../supabaseClient'; // Adjust the path to your Supabase client

  let selectedDate;
  let selectedTime;
  const showModal = writable(false);
  let searchQuery = '';
  let searchResults = writable([]);
  let loading = writable(false);

  const gpSurgeryName = 'GP Surgery Name';
  const gpAddress = 'Line 1, Line 2, City, County, Postcode';

  function toggleModal() {
    showModal.update(n => !n);
  }

  function saveAppointment() {
    console.log(`Appointment set for ${selectedDate} at ${selectedTime}`);
  }

  async function performSearch() {
    loading.set(true);
    const { data, error } = await supabase
      .from('clinicians')
      .select('first_name, last_name')
      .ilike('first_name', `%${searchQuery}%`)
      .or(`ilike(last_name, '%${searchQuery}%')`);

    if (error) {
      console.error('Error fetching clinicians:', error);
      searchResults.set([]);
    } else {
      searchResults.set(data);
    }
    loading.set(false);
    showModal.set(false);
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleModal();
    }
  }
</script>

<style>
  .container {
    font-family: 'Frutiger', sans-serif;
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }

  .gp-info {
    margin-bottom: 1rem;
  }

  .gp-info p {
    margin: 0.25rem 0;
  }

  .search-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .search-button {
    display: inline-flex; 
    align-items: center;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    color: inherit; 
  }

  .search-icon {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 0.5rem;
    margin-right: 0.5rem; 
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px; 
    height: 30px;
  }

  .modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    width: 80%; 
    max-width: 600px; 
    height: auto; 
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .modal-bg {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .show {
    display: block;
  }

  .input-field {
    margin-bottom: 1rem;
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .button {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    color: black;
    padding: 1rem 2rem;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    width: 100%;
  }

  .button-secondary {
    background-color: #f0f0f0;
    color: black;
  }

  .date-input, .time-input {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  label {
    margin-bottom: 0.5rem;
  }

  input[type="date"],
  input[type="time"] {
    max-width: 100%;
    box-sizing: border-box;
  }

  .search-results {
    list-style-type: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .search-results li {
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
  }

  .search-results li:last-child {
    border-bottom: none;
  }

  .search-results li:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
</style>

<div class="container">
  <div class="gp-info">
    <p>{gpSurgeryName}</p>
    <p>{gpAddress}</p>
  </div>

  <div class="search-container">
    <button class="search-button" on:click={toggleModal}>
      <div class="search-icon">🔍</div>
      <span>Search for a Clinician</span>
    </button>
  </div>

  {#if $showModal}
    <div class="modal-bg show" on:click={toggleModal}></div>
    <div class="modal show">
      <input class="input-field" type="text" placeholder="Search..." bind:value={searchQuery}>
      <button class="button-secondary" on:click={performSearch}>Search</button>
    </div>
  {/if}

  <div class="date-input">
    <label for="date">Select Date:</label>
    <input class="input-field" type="date" id="date" bind:value={selectedDate}>
  </div>

  <div class="time-input">
    <label for="time">Select Time:</label>
    <input class="input-field" type="time" id="time" bind:value={selectedTime}>
  </div>

  <button class="button" on:click={saveAppointment}>Book appointment</button>

  <!-- Display search results -->
  {#if !$loading && $searchResults.length > 0}
    <ul class="search-results">
      {#each $searchResults as result}
        <li>{result.first_name} {result.last_name}</li>
      {/each}
    </ul>
  {/if}
</div>
