<script>
    import { goto } from '$app/navigation';
  
    const navigateTo = (page) => {
      if (page === 'acute') {
        goto('/patientPath/acute-prescriptions');
      } else if (page === 'repeat') {
        goto('/patientPath/repeat-prescriptions');
      }
    };
  </script>
  
  <style>
    .container {
      max-width: 600px;
      margin: auto;
      padding: 16px;
      font-family: Arial, sans-serif;
    }
  
    .header {
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 16px;
    }
  
    .cta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      padding: 16px;
      margin-bottom: 8px;
      background-color: #d3d3d3;
      cursor: pointer;
    }
  
    .cta-item:hover {
      background-color: #c0c0c0;
    }
  
    .cta-text {
      font-weight: bold;
    }
  
    .cta-arrow {
      font-size: 24px;
    }
  
    @media (max-width: 600px) {
      .container {
        padding: 8px;
      }
  
      .cta-item {
        padding: 12px;
      }
    }
  </style>
  
  <div class="container">
    <div class="header">PRESCRIPTIONS</div>
    <div class="cta-item" on:click={() => navigateTo('acute')}>
      <div class="cta-text">Acute (short-term) medicines</div>
      <div class="cta-arrow">10 ➔</div>
    </div>
    <div class="cta-item" on:click={() => navigateTo('repeat')}>
      <div class="cta-text">Repeat medicines</div>
      <div class="cta-arrow">10 ➔</div>
    </div>
  </div>
  