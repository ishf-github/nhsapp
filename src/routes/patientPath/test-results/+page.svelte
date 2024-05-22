<script>
    import { onMount } from 'svelte';
    import { supabase } from '../../../supabaseClient'; // Adjust the path as needed
  
    let test = {};
  
    // Fetch test data from the database on component mount
    onMount(async () => {
      const { data, error } = await supabase
        .from('tests')
        .select('test_name, test_date, clinician_comments, result')
        .eq('id', 1) // Replace with the actual id of the test
        .single();
  
      if (error) {
        console.error('Error fetching test:', error);
      } else {
        test = data;
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
  
    .section {
      background-color: #f0f0f0;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
    }
  
    .section h2 {
      margin: 0 0 1rem 0;
    }
  
    .section p {
      margin: 0.5rem 0;
    }
  
    .section ul {
      margin: 0;
      padding-left: 1.2rem;
    }
  
    .section li {
      margin-bottom: 0.5rem;
    }
  </style>
  
  <div class="container">
    <div class="header">{test.test_name}</div>
    
    <div class="section">
      <h2>Test date</h2>
      <p>Date: {new Date(test.test_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p><strong>Clinician Comments:</strong></p>
      <ul>
        {#each test.clinician_comments as comment}
          <li>{comment}</li>
        {/each}
      </ul>
    </div>
  
    <div class="section">
      <h2>Your result</h2>
      <p>{test.test_name}:</p>
      <p>{test.result}</p>
    </div>
  </div>
  