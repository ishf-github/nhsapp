<script>
  // Import necessary modules and functions
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '../../supabaseClient.js';

  // Variable to store providers
  let providers = [];

  // Fetch  list of clinicians from database on component mount
  onMount(async () => {
    const { data, error } = await supabase
      .from('clinicians')
      .select('*');

    if (error) console.log('Error:', error);
    else providers = data;
  });

  // Declare variables to bind with input fields
  let email = '';
  let password = '';

  // Function to handle user login
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    // If login is successful, navigate to clinician home page
    if (data.user && data.session) {
      goto('/clinicianPath/clinician-home');
    } else {
      console.log(error);
    }
  };

  // Function to navigate to patient sign-in page
  const navigateToPatientSignIn = () => {
    goto('../patient-signin');
  };

  // Function to navigate to provider registration page
  const navigateToProviderRegistration = () => {
    goto('../clinician-registration');
  };
</script>

<style>
  /* Page styling */
  .login-container {
    font-family: 'Frutiger', sans-serif;
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

  .register {
    width: 100%;
    text-align: center;
    background-color: white;
    color: #005EB8;
    border: 2px solid #005EB8;
    border-radius: 4px;
    padding: 0.5rem;
  }

  .forgot-password, .switch-user {
    text-align: center;
    color: #005EB8;
    cursor: pointer;
    padding: 0.5rem;
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
      <img src="src\myNHS Logo.png" alt="myNHS logo" style="max-width: 120px;">
    </div>
    <h2>Log in</h2>
    <div class="input-container">
      <input type="email" bind:value={email} placeholder="Email">
    </div>
    <div class="input-container">
      <input type="password" bind:value={password} placeholder="Password">
    </div>
    <button class="login-button" on:click={handleLogin}>Sign in</button>
    <button class="register" on:click={navigateToProviderRegistration}>Register account</button>
    <div class="forgot-password">
      Forgot password?
    </div>
    <div class="switch-user" on:click={navigateToPatientSignIn}>
      Patient? Sign in here
    </div>
  </div>
</div>
