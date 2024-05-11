<script>
  import { goto } from '$app/navigation'; 
  import { supabase } from '../../supabaseClient';
  import { v4 as uuidv4 } from 'uuid';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let errorMessage = '';

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
  };

  const handleRegistration = async () => {
    
    const { data: existingProvider, error: providerError } = await supabase
      .from('providers')
      .select('email')
      .eq('email', email)
      .single();

    if (providerError && providerError.message !== "Item not found") {
      errorMessage = 'Failed to check existing accounts.';
      console.error('Error:', providerError);
      return;
    }

    if (existingProvider) {
      errorMessage = 'Email already registered.';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match.';
      return;
    }

    // Generate a new provider ID and verification code
    const newProviderId = uuidv4();
    const verificationCode = generateVerificationCode();
    const expiryTimestamp = new Date(new Date().getTime() + 10 * 60000); // Sets expiry time to 10 minutes from now

    // Insert the new verification entry
    const { data: verificationData, error: verificationError } = await supabase
      .from('provider-verification')
      .insert([{
        verification_id: uuidv4(),
        provider_id: newProviderId,
        verification_code: verificationCode,
        expiry_timestamp: expiryTimestamp,
        verified: false,
        created_at: new Date()
      }]);

    if (verificationError) {
      errorMessage = 'Failed to create verification record.';
      console.error('Verification Error:', verificationError);
      return;
    }

    // Navigate to providerVerification page
    goto('../providerVerification');
  };

  const navigateToSignIn = () => {
    goto('../providerSignIn');
  };
</script>

  
  <style>
    .registration-container {
      font-family: 'Frutiger', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
  
    .registration-card {
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
  
    .registration-button {
      width: 100%;
      background-color: #005EB8;
      color: white;
      padding: 10px;
      border: none;
      border-radius: 4px;
      margin-bottom: 1rem;
      cursor: pointer;
    }
  
    .switch-user {
      text-align: center;
      color: #005EB8;
      cursor: pointer;
      padding-top: 16px;
    }
  
    @media (max-width: 600px) {
      .registration-card {
        padding: 20px;
      }
    }
  </style>
  
  <div class="registration-container">
    <div class="registration-card">
        <div class="logo">
            <img src="src/myNHS Logo.png" alt="myNHS logo" style="max-width: 120px;">
        </div>
        <h2>Register</h2>
        {#if errorMessage}
            <p class="error-message" style="color: red;">{errorMessage}</p>
        {/if}
        <div class="input-container">
            <input type="email" bind:value={email} placeholder="Email">
        </div>
        <div class="input-container">
            <input type="password" bind:value={password} placeholder="Password">
        </div>
        <div class="input-container">
            <input type="password" bind:value={confirmPassword} placeholder="Confirm Password">
        </div>
        <button class="registration-button" on:click={handleRegistration}>Agree and continue</button>
        <div class="switch-user" on:click={navigateToSignIn}>
            Already registered? Sign in here
        </div>
    </div>
</div>

  