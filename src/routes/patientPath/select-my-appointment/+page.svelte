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
      font-family: 'Frutiger W01', sans-serif;
      font-weight: bold;
      margin-bottom: 1rem;
      background-color: #005EB8;
      color: white;
      padding: 1rem;
      text-align: center;
    }
  
    .cta-button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: white;
      color: black;
      font-weight: bold;
      margin-bottom: 1rem;
      cursor: pointer;
      border: none;
      width: 100%;
    }
  
    .cta-button:hover {
      background-color: white;
      color: #8F2855;
      font-weight: bold;
    }
  
    .arrow {
      font-size: 1.5rem;
    }
  </style>
  
  <div class="container">
    <div class="header">Select Appointment Type</div>
    <button class="cta-button" on:click={() => navigateTo('patientPath/book-appointment')}>
      <span>Face-to-face appointment</span>
      <span class="arrow">➔</span>
    </button>
    <button class="cta-button" on:click={() => navigateTo('patientPath/book-video-appointment')}>
      <span>Video call appointment</span>
      <span class="arrow">➔</span>
    </button>
    <button class="cta-button" on:click={() => navigateTo('patientPath/book-phone-appointment')}>
      <span>Telephone appointment</span>
      <span class="arrow">➔</span>
    </button>
  </div>
  