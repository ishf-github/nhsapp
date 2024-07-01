<script>
  import { goto } from '$app/navigation';

  function navigateTo(page) {
    goto(`/${page}`);
  }
</script>

<style>
  .container {
    font-family: 'Frutiger', sans-serif;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .header {
    font-weight: bold;
    background-color: #005EB8;
    color: white;
    margin-bottom: 1rem;
    padding: 1rem;
    text-align: center;
    border-radius: 4px;
  }

  .cta-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f0f0f0;
    margin-bottom: 1rem;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: background-color 0.3s;
    font-size: 1rem;
    text-align: left;
  }

  .cta-button:hover {
    background-color: #e0e0e0;
  }

  .arrow {
    font-size: 1.5rem;
    color: #005EB8;
  }
</style>

<div class="container">
  <div class="header">Appointments</div>
  <button class="cta-button" on:click={() => navigateTo('patientPath/view-gp-appointments')}>
    <span>GP Surgery Appointments</span>
    <span class="arrow">➔</span>
  </button>
</div>
