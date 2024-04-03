<script>
    let medications = [
      { name: 'Ibuprofen', brand: 'Nurofen', dosage: '500mg', instructions: '1 tablet up to 3 times a day.' },
      // More medication objects...
    ];
  
    function selectMedication(medicationId) {
      // Logic to handle medication selection
    }
  </script>
  
  <style>
    .medication-container {
      padding: 1rem;
    }
  
    .medication-card {
      display: grid;
      grid-template-columns: auto 100px;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
      padding: 1rem;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
  
    .medication-info {
      display: flex;
      flex-direction: column;
    }
  
    .medication-name {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
  
    .medication-details {
      font-size: 0.9rem;
      color: #666;
      line-height: 1.4;
    }
  
    .select-button {
      justify-self: end;
      padding: 0.5rem 1rem;
      background-color: #005EB8; /* Primary color */
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
    }
  </style>
  
  <div class="medication-container">
    {#each medications as medication}
      <div class="medication-card">
        <div class="medication-info">
          <div class="medication-name">{medication.name}</div>
          <div class="medication-details">
            <div>Brand: {medication.brand}</div>
            <div>Dosage: {medication.dosage}</div>
            <div>Dosage Instructions: {medication.instructions}</div>
          </div>
        </div>
        <button class="select-button" on:click={() => selectMedication(medication.id)}>
          SELECT
        </button>
      </div>
    {/each}
  </div>
  