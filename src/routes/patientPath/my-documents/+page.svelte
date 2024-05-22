<script>
  import { onMount } from 'svelte';
  import { supabase } from '../../../supabaseClient';

  let documents = [];

  // Fetch documents from the database on component mount
  onMount(async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('type, date, format, size, url');

    if (error) {
      console.error('Error fetching documents:', error);
    } else {
      documents = data;
    }
  });

  function downloadDocument(url) {
    window.open(url, '_blank');
  }
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
    font-weight: bold;
    margin-bottom: 1rem;
    background-color: #d3d3d3;
    padding: 1rem;
    text-align: center;
  }

  .document {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #d3d3d3;
    margin-bottom: 1rem;
    cursor: pointer;
    border: none;
    width: 100%;
  }

  .document:hover {
    background-color: #ccc;
  }

  .arrow {
    font-size: 1.5rem;
  }
</style>

<div class="container">
  <div class="header">DOCUMENTS</div>
  {#each documents as document}
    <div class="document" on:click={() => downloadDocument(document.url)}>
      <div>
        <div>{document.type} ({new Date(document.date).toLocaleDateString('en-GB')})</div>
        <div>({document.format}, {document.size}KB)</div>
      </div>
      <span class="arrow">➔</span>
    </div>
  {/each}
</div>
