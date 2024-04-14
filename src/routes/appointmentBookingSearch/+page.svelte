<script>
    import { writable } from 'svelte/store';

    let selectedDate;
    let selectedTime;
    const showModal = writable(false);
    let searchQuery = '';

    function toggleModal() {
        showModal.update(n => !n);
    }

    function saveAppointment() {
        // Implement appointment saving logic here
        console.log(`Appointment set for ${selectedDate} at ${selectedTime}`);
    }

    function performSearch() {
        // Implement search logic here
        console.log(`Searching for: ${searchQuery}`);
        showModal.set(false);
    }
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        max-width: 600px;
        margin: 0 auto;
        padding: 1rem;
    }

    .search-container {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .search-button {
        display: inline-flex; /* Use inline-flex for aligning text next to icon */
        align-items: center;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        color: inherit; /* Inherits font properties from parent */
    }

    .search-icon {
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 50%;
        padding: 0.5rem;
        margin-right: 0.5rem; /* Space between icon and text */
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px; /* Smaller size for just the icon */
        height: 30px;
    }

    .modal {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        width: 80%; /* Sets the modal width to 80% of the viewport width */
        max-width: 600px; /* Sets a maximum width for the modal */
        height: auto; /* Height adjusts to the content */
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
      padding: 1 rem 2 rem;
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
        /* Adjust width as necessary */
        max-width: 100%;
        box-sizing: border-box;
    }
</style>

<div class="container">
    <div class="search-container">
        <button class="search-button" on:click={toggleModal}>
            <div class="search-icon">🔍</div>
            <span>Search for Patient</span>
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

    <button class="button" on:click={saveAppointment}>Save to Calendar</button>
</div>
