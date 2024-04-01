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
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 12px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .patient-info {
    flex-grow: 1;
  }
  
  .patient-details {
    margin-bottom: 8px;
  }

  .patient-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .cta-button {
    padding: 6px 12px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    cursor: pointer;
    margin-top: 8px;
  }

  .messages {
    max-height: 300px;
    overflow-y: auto;
  }

  .message {
    background-color: #d1d1d1;
    margin: 8px;
    padding: 8px;
  }

    .button {
      margin-top: 8px; /* Adds spacing between buttons */
    }
  
    .icon-round {
    position: fixed;
    bottom: 64px; /* Distance from bottom, adjust as needed */
    right: 20px; /* Distance from right, adjust as needed */
    z-index: 30; /* Higher than nav's z-index to ensure visibility */
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    background-color: #fff; /* Or any desired background color */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
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
  
    <button class="icon-button icon-round" on:click={() => handleAction('notes')}>NOTES</button>

</div>