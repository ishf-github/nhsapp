<script>
    import { onMount } from 'svelte';
    import { supabase } from '../../../supabaseClient'; // Adjust the path as needed
  
    let conditions = [];
  
    // Fetch health condition data from the database on component mount
    onMount(async () => {
      const { data, error } = await supabase
        .from('conditions')
        .select('condition, diagnosis_date');
  
      if (error) {
        console.error('Error fetching conditions:', error);
      } else {
        conditions = data;
      }
    });
  </script>
  
  <style>
    .container {
      font-family: 'Frutiger', sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }
  
    .header {
      font-weight: bold;
      margin-bottom: 1rem;
      background-color: #d3d3d3;
      padding: 1rem;
      text-align: center;
    }
  
    .condition-item {
      background-color: #f0f0f0;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
    }
  
    .condition-item h2 {
      margin: 0 0 1rem 0;
    }
  
    .condition-item p {
      margin: 0.5rem 0;
    }
  </style>
  
  <div class="container">
    <div class="header">Health Conditions</div>
    {#each conditions as condition}
      <div class="condition-item">
        <h2>{condition.condition}</h2>
        <p>Date: {new Date(condition.diagnosis_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
    {/each}
  </div>
  