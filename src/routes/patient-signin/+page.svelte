<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '../../supabaseClient.js';

  let email = '';
  let password = '';

  const handleLogin = async () => {
    console.log("Starting login process");
    console.log("Email:", email);
    console.log("Password:", password);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.log("Sign-in response data:", data);
    console.log("Sign-in response error:", error);

    if (data.user && data.session) {
      const { user } = data;
      console.log("User signed in:", user);

      const { data: userData, error: userError } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', user.id)
        .single();

      console.log("Fetched userData:", userData);
      console.log("Fetched userError:", userError);

      if (userError && userError.code !== 'PGRST116') {
        console.error("Error fetching user data:", userError);
      } else if (!userData) {
        const {
          firstName, lastName, dateOfBirth, sex, nhsNumber, addressLine1,
          addressLine2, city, postcode, phoneNumber, emergencyContactName,
          emergencyContactNumber
        } = user.user_metadata;

        console.log("User metadata:", user.user_metadata);

        const { data: insertData, error: insertError } = await supabase
          .from('patients')
          .insert([{
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            sex: sex,
            nhs_number: nhsNumber,
            address: `${addressLine1}, ${addressLine2}, ${city}, ${postcode}`,
            phone_number: phoneNumber,
            emergency_contact_name: emergencyContactName,
            emergency_contact_phone: emergencyContactNumber,
            email: user.email,
            patient_id: user.id 
          }]);

        console.log("Insert data:", insertData);
        console.log("Insert error:", insertError);

        if (insertError) {
          console.error('Error inserting patient details:', insertError);
          return null;
        } else {
          console.log('Patient details inserted successfully');
        }
      }

      console.log("Redirecting to /patientPath/patient-home");
      goto('/patientPath/patient-home');
    } else {
      console.log("Sign-in error:", error);
    }
  };

  const navigateToProviderSignIn = () => {
    console.log("Navigating to clinician sign-in");
    goto('../clinician-signin');
  };

  const navigateToPatientRegistration = () => {
    console.log("Navigating to patient registration");
    goto('../patient-registration');
  };
</script>

<style>
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
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 1rem;
    text-align: center;
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
      <img src="/src/myNHS Logo.png" alt="myNHS logo" style="max-width: 120px;">
    </div>
    <h2>Log in</h2>
    <div class="input-container">
      <input type="email" bind:value={email} placeholder="Email">
    </div>
    <div class="input-container">
      <input type="password" bind:value={password} placeholder="Password">
    </div>
    <button class="login-button" on:click={handleLogin}>Sign in</button>
    <button class="register" on:click={navigateToPatientRegistration}>Register account</button>
    <div class="forgot-password">
      Forgot password?
    </div>
    <div class="switch-user" on:click={navigateToProviderSignIn}>
      Clinician? Sign in here
    </div>
  </div>
</div>
