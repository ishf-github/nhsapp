<script>
    import { onMount } from 'svelte';
    import { supabase } from '../../../supabaseClient'; // Adjust the path as needed
    import { goto } from '$app/navigation';
  
    let tests = [];
  
    // Fetch test data from the database on component mount
    onMount(async () => {
      const { data, error } = await supabase
        .from('tests')
        .select('test_name, test_date, clinician_comments, id');
  
      if (error) {
        console.error('Error fetching tests:', error);
      } else {
        tests = data;
      }
    });
  
    function navigateToTestResult(testId) {
      goto(`/test-results/${testId}`);
    }
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
  
    .test-item {
      background-color: #f0f0f0;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      cursor: pointer;
    }
  
    .test-item h2 {
      margin: 0 0 1rem 0;
    }
  
    .test-item p {
      margin: 0.5rem 0;
    }
  
    .test-item ul {
      margin: 0;
      padding-left: 1.2rem;
    }
  
    .test-item li {
      margin-bottom: 0.5rem;
    }
  </style>
  
  <div class="container">
    <div class="header">Test Results</div>
    {#each tests as test}
      <div class="test-item" on:click={() => navigateToTestResult(test.id)}>
        <h2>{test.test_name}</h2>
        <p>Date: {new Date(test.test_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p><strong>Clinician Comments:</strong></p>
        <ul>
          {#each test.clinician_comments as comment}
            <li>{comment}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
  