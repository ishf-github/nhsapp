<script>
  import { goto } from '$app/navigation';

  function navigateTo(page) {
    goto(`/${page}`);
  }
</script>

<style>
  .container {
    max-width: 600px;
    margin: auto;
    padding: 16px;
    font-family: Arial, sans-serif;
  }

  .header {
    font-family: 'Frutiger', sans-serif;
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 16px;
    text-align: center;
  }

  .cta-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    padding: 16px;
    margin-bottom: 8px;
    background-color: #005EB8;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Frutiger', sans-serif;
  }

  .cta-button:hover {
    background-color: #004494;
  }

  .cta-text {
    font-weight: bold;
  }

  .arrow {
    font-size: 24px;
  }

  @media (max-width: 600px) {
    .container {
      padding: 8px;
    }

    .cta-button {
      padding: 12px;
    }
  }
</style>

<div class="container">
  <div class="header">Appointments</div>
  <div class="cta-button" on:click={() => navigateTo('patientPath/select-my-appointment')}>
    <div class="cta-text">Book an appointment</div>
    <div class="arrow">➔</div>
  </div>
  <div class="cta-button" on:click={() => navigateTo('patientPath/view-gp-appointments')}>
    <div class="cta-text">View past and upcoming appointments</div>
    <div class="arrow">➔</div>
  </div>
</div>
