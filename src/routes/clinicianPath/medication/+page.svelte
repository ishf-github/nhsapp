<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient'; 

  let medications = [];
  let showModal = false;
  let selectedMedication = {};

  async function fetchMedications() {
    let { data, error } = await supabase
      .from('medication')
      .select('medication_id, name, brand_name, description, form, strength, conditions_treated, side_effects, dosage_instructions');

    if (error) {
      console.error('Error fetching medications:', error);
    } else {
      medications = data;
    }
  }

  function selectMedication(medicationId) {
    selectedMedication = medications.find(med => med.medication_id === medicationId);
    showModal = true;
  }

  onMount(() => {
    fetchMedications();
  });

  function closeModal() {
    showModal = false;
    selectedMedication = {};
  }
</script>

<style>
  .medication-container {
    font-family: 'Frutiger', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
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
    width: 100%;
    max-width: 600px;
  }

  .medication-info {
    display: flex;
    flex-direction: column;
  }

  .medication-name {
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-family: 'Frutiger', sans-serif;
  }

  .medication-details {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
    font-family: Arial, sans-serif;
  }

  .select-button {
    justify-self: end;
    padding: 0.5rem 1rem;
    background-color: #005EB8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    font-family: 'Frutiger', sans-serif;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Frutiger', sans-serif;
  }

  .modal-body {
    font-family: Arial, sans-serif;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
</style>

<div class="medication-container">
  {#each medications as medication}
    <div class="medication-card">
      <div class="medication-info">
        <div class="medication-name">{medication.name}</div>
        <div class="medication-details">
          <div>Brand: {medication.brand_name}</div>
          <div>Dosage: {medication.strength}</div>
          <div>Dosage Instructions: {medication.dosage_instructions}</div>
        </div>
      </div>
      <button class="select-button" on:click={() => selectMedication(medication.medication_id)}>
        Info
      </button>
    </div>
  {/each}

  {#if showModal}
    <div class="modal" on:click={closeModal}>
      <div class="modal-content" on:click|stopPropagation>
        <div class="modal-header">
          <h2>{selectedMedication.name}</h2>
          <button class="close-button" on:click={closeModal}>&times;</button>
        </div>
        <div class="modal-body">
          <div><strong>Brand:</strong> {selectedMedication.brand_name}</div>
          <div><strong>Description:</strong> {selectedMedication.description}</div>
          <div><strong>Form:</strong> {selectedMedication.form}</div>
          <div><strong>Strength:</strong> {selectedMedication.strength}</div>
          <div><strong>Conditions Treated:</strong> {selectedMedication.conditions_treated}</div>
          <div><strong>Side Effects:</strong> {selectedMedication.side_effects}</div>
          <div><strong>Dosage Instructions:</strong> {selectedMedication.dosage_instructions}</div>
        </div>
      </div>
    </div>
  {/if}
</div>
