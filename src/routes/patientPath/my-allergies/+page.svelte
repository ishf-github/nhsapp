<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';

  type Allergy = {
    allergen: string;
    diagnosis_date: string;
  };

  let allergies: Allergy[] = [];

  onMount(async () => {
    const { data, error } = await supabase
      .from('allergies')
      .select('allergen, diagnosis_date');

    if (error) {
      console.error('Error fetching allergies:', error);
    } else {
      allergies = data as Allergy[];
    }
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }

  .header {
    font-family: 'Frutiger', sans-serif;
    font-weight: bold;
    margin-bottom: 1rem;
    background-color: #005EB8;
    color: white;
    padding: 1rem;
    text-align: center;
  }

  .allergy-info {
    background-color: #f0f0f0;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .allergy-info h2 {
    margin: 0 0 1rem 0;
  }

  .allergy-info p {
    margin: 0.5rem 0;
  }
</style>

<div class="container">
  <div class="header">Allergies and adverse reactions</div>
  {#each allergies as allergy}
    <div class="allergy-info">
      <h2>{allergy.allergen}</h2>
      <p>Date: {new Date(allergy.diagnosis_date).toLocaleDateString('en-GB')}</p>
    </div>
  {/each}
</div>
