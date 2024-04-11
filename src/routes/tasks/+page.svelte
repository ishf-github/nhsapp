<script>
    import { writable } from 'svelte/store';
    import Button from "../../components/Button.svelte";
    import { goto } from '$app/navigation';
    import { onMount, onDestroy } from 'svelte';
    import { includeRightButton, showReferral, showPrescription, showFilters, statusFilter } from '../../stores.js'; 


let tasks = [
  { id: '0001', taskType: 'REFERRAL', notes: 'Notes', status: '✓' },
  { id: '0002', taskType: 'PRESCRIPTION', notes: 'Notes', status: '✕' },

];

$: filteredTasks = tasks.filter(task => {
        let matchesType = true;
        let matchesStatus = true;

        if (!$showReferral && !$showPrescription) { 
            matchesType = true;
        } else {
            matchesType = false; 
            if ($showReferral && task.taskType === 'REFERRAL') {
                matchesType = true;
            }
            if ($showPrescription && task.taskType === 'PRESCRIPTION') {
                matchesType = true;
            }
        }

        if ($statusFilter === 'All') {
            matchesStatus = true;
        } else if ($statusFilter === '✓' && task.status === '✓') {
            matchesStatus = true;
        } else if ($statusFilter === '✕' && task.status === '✕') {
            matchesStatus = true;
        } else {
            matchesStatus = false;
        }

        return matchesType && matchesStatus;
    });

    
    function openNotes(taskId) {
        
    }

    onMount(() => {
    includeRightButton.set(true);
    });

  onDestroy(() => {
    
    includeRightButton.set(false);
    });

    function setStatusFilter(status) {
    statusFilter.set(status);
    }

    function toggleFilters() {
    showFilters.update(n => !n);
    }

</script>
    
  
<!-- {#if includeRightButton}
<div class="dropdown">
    <button class="filter-button" on:click={() => showFilters.update(n => !n)}>Filters</button>

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
{/if} -->


  <style>
    /* .dropdown {
    position: relative;
    display: inline-block;
  } */

  /* .dropbtn {
    background-color: #4CAF50;
    color: white;
    padding: 8px;
    font-size: 16px;
    border: none;
    cursor: pointer;
  } */

  /* .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }  
   */
  /* .dropdown-content label,
  .dropdown-content button {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  } */

  /* .dropdown-content button {
    background: none;
    border: none;
    text-align: left;
  } */

  /* .dropdown:hover .dropdown-content {
    display: block;
  } */

    .tasks-container {
      padding: 1rem;
    }
  
    .task-header {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr 1fr;
      gap: 1rem;
      font-size: 11px; 
      text-transform: uppercase; 
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
      box-shadow: 0 2px 4px rgba, 0, 0.05;
      margin-top: 1rem;
      align-items: center;
    }
  
    .task-card div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
    .notes-button {
      color: #005EB8; 
      cursor: pointer;
      text-decoration: underline;
    }
  
    .status {
      text-align: center;
      font-size: larger; 
    }
    
    .checkmark {
      color: green; 
    }
  
    .crossmark {
      color: red;
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
  </style>
  
  <div class="tasks-container">
    <div class="task-header">
      <div>ID</div>
      <div>TASK TYPE</div>
      <div>NOTES</div>
      <div>STATUS</div>
    </div>
    {#each filteredTasks as task}
  <div class="task-card">
    <div>{task.id}</div>
    <div>{task.taskType}</div>
    
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

<button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>
  </div>
  