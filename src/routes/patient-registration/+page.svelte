<script>
  import { goto } from '$app/navigation'; 
  import { supabase } from '../../supabaseClient';

  let firstName = '';
  let lastName = '';
  let dateOfBirth = '';
  let sex = '';
  let nhsNumber = '';
  let addressLine1 = '';
  let addressLine2 = '';
  let city = '';
  let postcode = '';
  let phoneNumber = '';
  let emergencyContactName = '';
  let emergencyContactNumber = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let errorMessage = '';

  const handleRegistration = async () => {
    if (password !== confirmPassword) {
      errorMessage = "Passwords do not match";
      return;
    }
    
    const { data, error } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
        options: {
          data: {
            provider: false,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            sex: sex,
            nhs_number: nhsNumber,
            address: `${addressLine1}, ${addressLine2}, ${city}, ${postcode}`,
            phone_number: phoneNumber,
            emergency_contact_name: emergencyContactName,
            emergency_contact_phone: emergencyContactNumber
          }
        }
      }
    );

    if (error) {
      console.log("Error:", error);
      errorMessage = error.message;
    } else {
      console.log("Registration successful:", data);
      navigateToSignIn();
    }
  };

  const insertPatientDetails = async (user) => {
    const { data, error } = await supabase
      .from('patients')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          nhs_number: nhsNumber,
          address: `${addressLine1}, ${addressLine2}, ${city}, ${postcode}`,
          phone_number: phoneNumber,
          email: user.email,
          emergency_contact_name: emergencyContactName,
          emergency_contact_phone: emergencyContactNumber,
          sex: sex
        }
      ]);

    if (error) {
      console.error('Error inserting patient details:', error);
    } else {
      console.log('Patient details inserted:', data);
    }
  };

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      const user = session.user;
      if (user.email_confirmed_at) {
        insertPatientDetails(user);
      }
    }
  });

  const navigateToSignIn = () => {
    goto('../patient-signin');
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

  input, select {
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
    role: button;
    tabindex: 0;
    outline: none;
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
      <input type="text" bind:value={firstName} placeholder="First Name">
    </div>
    <div class="input-container">
      <input type="text" bind:value={lastName} placeholder="Last Name">
    </div>
    <div class="input-container">
      <input type="date" bind:value={dateOfBirth} placeholder="Date of Birth">
    </div>
    <div class="input-container">
      <select bind:value={sex}>
        <option value="" disabled selected>Sex</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div class="input-container">
      <input type="text" bind:value={nhsNumber} placeholder="NHS Number">
    </div>
    <div class="input-container">
      <input type="text" bind:value={addressLine1} placeholder="Address Line 1">
    </div>
    <div class="input-container">
      <input type="text" bind:value={addressLine2} placeholder="Address Line 2">
    </div>
    <div class="input-container">
      <input type="text" bind:value={city} placeholder="City">
    </div>
    <div class="input-container">
      <input type="text" bind:value={postcode} placeholder="Postcode">
    </div>
    <div class="input-container">
      <input type="text" bind:value={phoneNumber} placeholder="Phone Number">
    </div>
    <div class="input-container">
      <input type="email" bind:value={email} placeholder="Email">
    </div>
    <div class="input-container">
      <input type="password" bind:value={password} placeholder="Password">
    </div>
    <div class="input-container">
      <input type="password" bind:value={confirmPassword} placeholder="Confirm Password">
    </div>
    <div class="input-container">
      <input type="text" bind:value={emergencyContactName} placeholder="Emergency Contact Name">
    </div>
    <div class="input-container">
      <input type="text" bind:value={emergencyContactNumber} placeholder="Emergency Contact Number">
    </div>
    <button class="registration-button" on:click={handleRegistration}>Agree and continue</button>
    <div class="switch-user" on:click={navigateToSignIn} role="button" tabindex="0" on:keydown={navigateToSignIn}>
      Already registered? Sign in here
    </div>    
  </div>
</div>
