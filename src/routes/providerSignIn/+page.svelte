<script>
    
    let email = '';
    let password = '';
  
    const handleLogin = () => {
    
    };
  </script>
  
  <style>
    /* body, html {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      background: #f0f0f0; 
    } */
  
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
  
    .login-card {
      background: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;
    }
  
    .logo {
      margin-bottom: 2rem;
      text-align: center;
    }
  
    h2 {
      text-align: center;
      color: #005EB8;
      margin-bottom: 1rem;
    }
  
    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  
    .login-button {
      width: 100%;
      background-color: #005EB8;
      color: white;
      padding: 10px;
      border: none;
      border-radius: 4px;
      margin-bottom: 1rem;
      cursor: pointer;
    }
  
    .forgot-password {
      text-align: center;
      color: #005EB8;
      cursor: pointer;
    }
  
    @media (max-width: 600px) {
      .login-card {
        padding: 20px;
      }
    }
  </style>
  
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <img src="path-to-your-logo.png" alt="myNHS logo" style="max-width: 120px;">
      </div>
      <h2>Log in</h2>
      <div class="input-container">
        <input type="email" bind:value={email} placeholder="Email">
      </div>
      <div class="input-container">
        <input type="password" bind:value={password} placeholder="Password">
      </div>
      <button class="login-button" on:click={handleLogin}>Sign in</button>
      <div class="forgot-password">
        Forgot password?
      </div>
    </div>
  </div>
  