<script>
  import { goto } from '$app/navigation'; 
  import { supabase } from '../../supabaseClient';
  import { onMount } from 'svelte';

  let firstName = '';
  let surname = '';
  let dateOfBirth = '';
  let gender = '';
  let nhsNumber = '';
  let email = '';
  let phoneNumber = '';
  let address = '';
  let department = '';
  let emergencyContactName = '';
  let emergencyContactPhone = '';
  let password = '';
  let confirmPassword = '';
  let errorMessage = '';

  let departments = [];

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
            provider: true,
            first_name: firstName,
            surname: surname,
            date_of_birth: dateOfBirth,
            gender: gender,
            nhs_number: nhsNumber,
            phone_number: phoneNumber,
            address: address,
            department: department,
            emergency_contact_name: emergencyContactName,
            emergency_contact_phone: emergencyContactPhone
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

  const navigateToSignIn = () => {
    goto('../clinician-signin');
  };

  onMount(async () => {
    const { data: departmentData, error } = await supabase
      .from('department_list')
      .select('department_name');
    
    if (error) {
      console.log("Error fetching departments:", error);
    } else {
      departments = departmentData;
    }
  });
</script>

<style>
  .registration-container {
    font-family: 'Frutiger W01', sans-serif;
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
          <input type="text" bind:value={surname} placeholder="Surname">
      </div>
      <div class="input-container">
          <input type="date" bind:value={dateOfBirth} placeholder="Date of Birth">
      </div>
      <div class="input-container">
          <select bind:value={gender}>
            <option value="" disabled selected>Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
      </div>
      <div class="input-container">
          <input type="text" bind:value={nhsNumber} placeholder="NHS Number">
      </div>
      <div class="input-container">
          <input type="email" bind:value={email} placeholder="Email">
      </div>
      <div class="input-container">
          <input type="text" bind:value={phoneNumber} placeholder="Phone Number">
      </div>
      <div class="input-container">
          <input type="text" bind:value={address} placeholder="Address">
      </div>
      <div class="input-container">
          <select bind:value={department}>
            <option value="" disabled selected>Select a department</option>
            {#each departments as dept}
              <option value={dept.department_name}>{dept.department_name}</option>
            {/each}
          </select>
      </div>
      <div class="input-container">
          <input type="text" bind:value={emergencyContactName} placeholder="Emergency Contact Name">
      </div>
      <div class="input-container">
          <input type="text" bind:value={emergencyContactPhone} placeholder="Emergency Contact Phone">
      </div>
      <div class="input-container">
          <input type="password" bind:value={password} placeholder="Password">
      </div>
      <div class="input-container">
          <input type="password" bind:value={confirmPassword} placeholder="Confirm Password">
      </div>
      <button class="registration-button" on:click={handleRegistration}>Agree and continue</button>
      <div class="switch-user" on:click={navigateToSignIn} role="button" tabindex="0" on:keydown={navigateToSignIn}>
        Already registered? Sign in here
      </div>    
  </div>
</div>
