<script>
    import { goto } from '$app/navigation';
  
    let departments = ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Radiology']; // Add more departments as needed
    let selectedDepartment = '';
    let providerNotes = '';
    
    function submitReferral() {
      // Implement the logic to submit the referral here
      console.log('Submitting referral to:', selectedDepartment);
      console.log('Provider notes:', providerNotes);
      // For now, let's navigate to a confirmation page or back to home
      goto('/confirmation'); // Replace with the actual route for your confirmation page
    }
    
    function attachFiles() {
      // Implement file attachment logic here
      console.log('Attaching files...');
    }
    
  </script>
  
  <style>
    /* Add styles specific to this page here, make sure these do not conflict with your +layout.svelte styles */
    .referral-page {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  
    select, textarea, button {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
    }
  
    button {
      cursor: pointer;
    }
  
    .attach-files-button {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 3rem; /* Adjust as needed */
      background-color: #ccc; /* Placeholder color, replace as needed */
      border: none;
    }
  
    /* You can adjust the styles as per your application's theme and requirements */
  </style>
  
  <div class="referral-page">
    <label for="department-select">Refer to Department:</label>
    <select id="department-select" bind:value={selectedDepartment}>
      <option value="">Please select a department</option>
      {#each departments as department}
        <option value={department}>{department}</option>
      {/each}
    </select>
  
    <div>
      <label for="attach-files">Attach Files:</label>
      <button class="attach-files-button" on:click={attachFiles}>ATTACH FILES</button>
    </div>
  
    <div>
      <label for="provider-notes">Provider Notes:</label>
      <textarea id="provider-notes" bind:value={providerNotes} rows="6"></textarea>
    </div>
  
    <button on:click={submitReferral}>SUBMIT REFERRAL</button>
  </div>
  
 
  