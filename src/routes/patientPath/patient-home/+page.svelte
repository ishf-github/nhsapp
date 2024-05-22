
<script>
    import Button from "../../../components/Button.svelte"; 
    import { goto } from '$app/navigation';
    
    const handleClick = () => {
        alert("Button clicked");
    };
  
    function navigateTo(page) {
      if (page === 'gpRecord') {
      goto('/patientPath/gp-record');
    } else if (page === 'myAppointments') {
      goto('/patientPath/my-appointments'); 
    } else if (page === 'myPrescriptions') {
      goto('/patientPath/my-prescriptions');
    } else if (page === 'myMessages') {
      goto('/patientPath/my-inbox');
    
  }
}
  </script>
  
  <style>
  .app-container {
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    width: 100%;
    height: calc(100vh - var(--header-height) - var(--search-bar-height) - var(--nav-bar-height));
    overflow-y: auto;
    padding: 16px;
    box-sizing: border-box;
    position: relative; 
    padding-bottom: 100px;
  }
  
  @media (max-width: 768px) { 
      .app-container {
        width: 100%;
        margin: 0; 
        padding: 4%;
      }
  
  
      .middle-buttons {
      display: flex;
      flex-direction: column;
      justify-content: space-around; 
      width: 100%;
      height: 100%; 
      padding: 4% 0; 
    }
  
  }
  
  @media (min-width: 769px) {
    .app-container {
        width: 100%;
        margin: 0; 
        padding: 4%;
      }
  
  
      .middle-buttons {
      display: flex;
      flex-direction: column;
      justify-content: space-around; 
      width: 100%;
      height: 100%; 
      padding: 4% 0; 
    }
  }
  
    /* .button {
      border: none;
      padding: 12px 20px;
      width: calc(100% - 40px);
      text-align: left;
      border-radius: 0;
      font-size: 16px;
      background-color: transparent;
      color: #000;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    } */
  
  .icon-button {
    width: 8vh;
    height: 8vh;
  }
  
  .icon-round {
      position: fixed;
      bottom: 64px; 
      right: 20px; 
      z-index: 30; 
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      background-color: #fff; 
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  
  
  :root {
    --header-height: 10vh;
    --nav-bar-height: 10vh;
    --icon-round-size: 10vh; 
    --icon-round-margin: 5vw; 
    --icon-round-total: calc(var(--icon-round-size) + var(--icon-round-margin)); 
  }
  
  
  </style>
  
  <div class="app-container">
  
    <div class="middle-buttons">
      <Button text="MY GP RECORD" action={() => navigateTo('gpRecord')} />
        <Button text="APPOINTMENTS" action={() => navigateTo('myAppointments')} />
        <Button text="PRESCRIPTIONS" action={() => navigateTo('myPrescriptions')} />
          <Button text="MESSAGES" action={() => navigateTo('myMessages')} />
    </div>
  </div>
  