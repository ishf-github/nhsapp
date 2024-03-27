<script>
    import Button from "../../components/Button.svelte";
    import { goto } from '$app/navigation';
    
    const handleClick = () => {
        alert("Button clicked");
    };
  
    // Remove the TypeScript types to use plain JavaScript
    function handleAction(button) {
      if (button === 'View Record') {
        goto('/patientChart'); // Navigate to the patients route
      }

      if (button === 'Send Message') {
        goto('/patientMessages'); // Navigate to the messages route
      }
    }

    const patients = [
      // Mock patient data
      {
        name: 'John Doe',
        dob: '01/01/1990',
        nextAppt: '01/01/2025',
        tasks: 'Outstanding Tasks'
      },
      // Add additional patient objects as needed
    ];

  </script>

<style>
    /* Reuse the styles from layout.svelte */
  
    .patient-container {
      background-color: #fff;
      margin: 16px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
    }
  
    .patient-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  
    .patient-actions {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  
    .button {
      margin-top: 8px; /* Adds spacing between buttons */
    }
  
    .round-button {
      position: fixed;
      bottom: 16px;
      right: 16px;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: none;
    }
  
    /* Add more styles as needed */
  </style>
  
  <div class="patients-page">
    <!-- List of patients -->
    {#each patients as patient}
      <div class="patient-container">
        <div class="patient-info">
            <h2>{patient.name}</h2>
            <p>Dob: {patient.dob}</p>
            <p>Next Appt: {patient.nextAppt}</p>
            <p>{patient.tasks}</p>
            <button class="button" on:click={() => handleAction('View Tasks', patient)}>VIEW</button>
        </div>
        <div class="patient-actions">
            <button class="button" on:click={() => handleAction('View Record', patient)}>VIEW RECORD</button>
            <button class="button" on:click={() => handleAction('Send Message', patient)}>SEND MESSAGE</button>
            <button class="button" on:click={() => handleAction('Schedule Appt', patient)}>SCHEDULE APPT</button>
            <button class="button" on:click={() => handleAction('Refer', patient)}>REFER</button>
        </div>
        </div>
    {/each}
  
    <button class="round-button" on:click={() => handleAction('Notes', {})}>!</button>

</div>