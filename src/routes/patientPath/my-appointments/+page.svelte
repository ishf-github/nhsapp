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
  
    .cta-button {
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
  
    .cta-button:hover {
      background-color: #ccc;
    }
  
    .arrow {
      font-size: 1.5rem;
    }
  </style>
  
  <div class="container">
    <div class="header">APPOINTMENTS</div>
    <button class="cta-button" on:click={() => navigateTo('patientPath/select-my-appointment')}>
      <span>Book an appointment</span>
      <span class="arrow">➔</span>
    </button>
    <button class="cta-button" on:click={() => navigateTo('patientPath/view-appointments')}>
      <span>View past and upcoming appointments</span>
      <span class="arrow">➔</span>
    </button>
  </div>
  