<script>
    import { writable } from 'svelte/store';
    import Button from "../../components/Button.svelte";
    import { goto } from '$app/navigation';
    import { onMount, onDestroy } from 'svelte';
    import { includeRightButton } from '../../stores.js'; // Adjust the path as necessary


let tasks = [
  { id: '0001', taskType: 'REFERRAL', notes: 'Notes', status: '✓' },
  { id: '0002', taskType: 'PRESCRIPTION', notes: 'Notes', status: '✕' },
  // ...other tasks
];

// Writable stores for filters
let showReferral = writable(true);
    let showPrescription = writable(true);
    let statusFilter = writable('All'); // Initialize with 'All' to show all tasks

    // Computed store for displaying tasks based on filters
    $: displayedTasks = tasks.filter(task => {
  return ($showReferral || task.taskType !== 'REFERRAL') &&
         ($showPrescription || task.taskType !== 'PRESCRIPTION') &&
         ($statusFilter === 'All' || task.status === $statusFilter);
});

    // Functions for handling user interactions
    function openNotes(taskId) {
        // Logic to open notes related to the taskId
    }

    function toggleFilterType(type) {
        if (type === 'REFERRAL') {
            $showReferral = !$showReferral;
        } else if (type === 'PRESCRIPTION') {
            $showPrescription = !$showPrescription;
        }
    }

    function setStatusFilter(value) {
        statusFilter.set(value);
    }

    onMount(() => {
    includeRightButton.set(true);
    });

  onDestroy(() => {
    // Optional, only if you want to hide the button when leaving the page
    includeRightButton.set(false);
    });
</script>
    
  
  {#if includeRightButton}
  <div class="dropdown">
    <button class="dropbtn">Filters</button>
    <div class="dropdown-content">
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
  </div>
{/if}


  <style>
    .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropbtn {
    background-color: #4CAF50;
    color: white;
    padding: 8px;
    font-size: 16px;
    border: none;
    cursor: pointer;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }  
  
  .dropdown-content label,
  .dropdown-content button {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  .dropdown-content button {
    background: none;
    border: none;
    text-align: left;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

    .tasks-container {
      padding: 1rem;
    }
  
    .task-header {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr 1fr;
      gap: 1rem;
      font-size: 11px; /* Updated font size */
      text-transform: uppercase; /* Making header text uppercase */
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #ddd;
    }
  
    .task-card {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr 1fr;
      gap: 1rem;
      padding: 0.5rem 1rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      margin-top: 1rem;
      align-items: center;
    }
  
    .task-card div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
    .notes-button {
      color: #005EB8; /* Sample color */
      cursor: pointer;
      text-decoration: underline;
    }
  
    .status {
      text-align: center;
      font-size: larger; /* Larger font for check mark and cross */
    }
    
    .checkmark {
      color: green; /* Green color for check mark */
    }
  
    .crossmark {
      color: red; /* Red color for cross mark */
    }
  </style>
  
  <div class="tasks-container">
    <div class="filter-container">
      <!-- Add checkboxes for filters -->
      <label>
        <input type="checkbox" bind:checked={$showReferral} on:click={() => toggleFilterType('REFERRAL')}> Referral
      </label>
      <label>
        <input type="checkbox" bind:checked={$showPrescription} on:click={() => toggleFilterType('PRESCRIPTION')}> Prescription
      </label>
      <button on:click={toggleStatusFilter}>
        {#if $statusFilter === ''}All
        {:else if $statusFilter === '✓'}Completed
        {:else}Not Completed
        {/if}
      </button>
    </div>
    <div class="task-header">
      <div>ID</div>
      <div>TASK TYPE</div>
      <div>NOTES</div>
      <div>STATUS</div>
    </div>
    {#each displayedTasks as task}
  <div class="task-card">
    <div>{task.id}</div>
    <div>{task.taskType}</div>
    
    <!-- Replacing the div with a button for accessibility -->
    <button 
      class="notes-button" 
      on:click={() => openNotes(task.id)}
    >
      {task.notes}
    </button>
    
    <div class="status {task.status === '✓' ? 'checkmark' : 'crossmark'}">
      {task.status}
    </div>
  </div>
{/each}
  </div>
  