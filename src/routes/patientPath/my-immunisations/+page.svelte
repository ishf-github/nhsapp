<script>
    import { onMount } from 'svelte';
    import { supabase } from '../../../supabaseClient'; // Adjust the path as needed
  
    let immunisations = [];
  
    // Fetch immunisation data from the database on component mount
    onMount(async () => {
      const { data, error } = await supabase
        .from('immunisations')
        .select('vaccine, date');
  
      if (error) {
        console.error('Error fetching immunisations:', error);
      } else {
        immunisations = data;
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
  
    .immunisation-item {
      background-color: #f0f0f0;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
    }
  
    .immunisation-item h2 {
      margin: 0 0 1rem 0;
    }
  
    .immunisation-item p {
      margin: 0.5rem 0;
    }
  </style>
  
  <div class="container">
    <div class="header">Immunisations</div>
    {#each immunisations as immunisation}
      <div class="immunisation-item">
        <h2>{immunisation.vaccine}</h2>
        <p>Date: {new Date(immunisation.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
    {/each}
  </div>
  