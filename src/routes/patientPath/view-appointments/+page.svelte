<script>
    import { goto } from '$app/navigation';
  
    function navigateTo(page) {
      goto(`/${page}`);
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
    <button class="cta-button" on:click={() => navigateTo('patientPath/view-gp-appointments')}>
      <span>GP surgery appointments</span>
      <span class="arrow">➔</span>
    </button>
    <button class="cta-button" on:click={() => navigateTo('patientPath/view-hospital-appointments')}>
      <span>Hospital referrals and appointments</span>
      <span class="arrow">➔</span>
    </button>
  </div>
  