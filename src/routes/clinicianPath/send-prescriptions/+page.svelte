<script>
  import { debounce } from 'lodash-es';

  let searchQuery = '';
  let selectedPatient = null;
  const patients = [
    { name: 'John Doe', dob: '01/01/1980', nextAppointment: '02/03/2024' },
   
  ];
  let filteredPatients = [];

  const updateFilteredPatients = debounce(() => {
    if (searchQuery.trim() === '') {
      filteredPatients = [];
    } else {
      filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }, 300);

  let medication, brand, dosage = '500mg', dosageInstructions = '1 tablet up to 3 times a day',
      quantity = '16', refills = 'No', providerNotes;
  const quantities = ['16', '32', '64'];
  const refillOptions = ['Yes', 'No'];

  function selectPatient(patient) {
    selectedPatient = patient;
    searchQuery = patient.name; 
    filteredPatients = []; 
  }

  function sendPrescription() {
    
    console.log('Sending prescription...');
  }
</script>

  
  <style>

    * {
    box-sizing: border-box;    
    }

    .prescription-form {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: #f9f9f9;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 3rem;
    
  }
  
    .form-group {
      margin-bottom: 1rem;
    }
  
    label {
      font-weight: bold;
      margin-bottom: 0.5rem;
      display: block;
    }
  
    input[type="text"],
    textarea,
    select {
    width: calc(100% - 1rem);
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  
    .button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
  
  
    .button-container {
      display: flex;
      justify-content: center;
    }
  

  .dropdown {
    position: relative;
  }

  .dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
  }

  .dropdown-item {
    padding: 0.5rem;
    cursor: pointer;
  }

  .dropdown-item:hover {
    background-color: #f0f0f0;
  }

  </style>
  
  <div class="prescription-form">
  <div class="form-group dropdown">
    <label for="search">Search for a Patient:</label>
    <input
      type="text"
      id="search"
      bind:value={searchQuery}
      on:input="{updateFilteredPatients}"
      placeholder="Enter patient name"
    />

    {#if filteredPatients.length > 0}
      <ul class="dropdown-list">
        {#each filteredPatients as patient}
          <li class="dropdown-item" on:click={() => selectPatient(patient)}>
            {patient.name}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  
  {#if selectedPatient}
    <div class="patient-display">
      <p><strong>Patient:</strong> {selectedPatient.name}</p>
      <p><strong>DoB:</strong> {selectedPatient.dob}</p>
      <p><strong>Next Appointment:</strong> {selectedPatient.nextAppointment}</p>
    </div>
  {/if}

    <div class="form-group">
      <label for="medication">Medication:</label>
      <input type="text" id="medication" bind:value={medication}>
    </div>
    
    <div class="form-group">
      <label for="brand">Brand:</label>
      <input type="text" id="brand" bind:value={brand}>
    </div>
  
    <div class="form-group">
      <label for="dosage">Dosage:</label>
      <input type="text" id="dosage" bind:value={dosage}>
    </div>
  
    <div class="form-group">
      <label for="instructions">Dosage Instructions:</label>
      <input type="text" id="instructions" bind:value={dosageInstructions}>
    </div>
  
    <div class="form-group">
      <label for="quantity">Quantity:</label>
      <select id="quantity" bind:value={quantity}>
        {#each quantities as q}
          <option value={q}>{q} tablets</option>
        {/each}
      </select>
    </div>
  
    <div class="form-group">
      <label for="refills">Refills?</label>
      <select id="refills" bind:value={refills}>
        {#each refillOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
  
    <div class="form-group">
      <label for="notes">Provider Notes:</label>
      <textarea id="notes" bind:value={providerNotes} rows="4"></textarea>
    </div>
  
    <div class="button-container">
      <button class="button" on:click={sendPrescription}>Send Prescription</button>
    </div>
  </div>
  