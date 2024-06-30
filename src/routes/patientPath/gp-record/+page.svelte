<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '../../../supabaseClient';

  let patient = {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    nhs_number: '',
    address: '',
    phone_number: '',
    email: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  };

  let counts = {
    appointments: 0,
    referrals: 0,
    prescriptions: 0
  };

  onMount(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (session && session.user) {
        const patientId = session.user.id;

        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('first_name, last_name, date_of_birth, nhs_number, address, phone_number, email, emergency_contact_name, emergency_contact_phone')
          .eq('patient_id', patientId)
          .single();
        if (patientError) throw patientError;
        patient = patientData;

        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('appointment_id', { count: 'exact' })
          .eq('patient_id', patientId);
        if (appointmentsError) throw appointmentsError;
        counts.appointments = appointmentsData.length;

        const { data: referralsData, error: referralsError } = await supabase
          .from('referrals')
          .select('referral_id', { count: 'exact' })
          .eq('patient_id', patientId);
        if (referralsError) throw referralsError;
        counts.referrals = referralsData.length;

        const { data: prescriptionsData, error: prescriptionsError } = await supabase
          .from('prescriptions')
          .select('prescription_id', { count: 'exact' })
          .eq('patient_id', patientId);
        if (prescriptionsError) throw prescriptionsError;
        counts.prescriptions = prescriptionsData.length;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

  function navigateTo(page) {
    goto(`/patientPath/${page}`);
  }
</script>

<style>
  .container {
    font-family: 'Frutiger', sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 16px;
  }

  .section {
    margin-bottom: 20px;
  }

  .header {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 8px;
  }

  .subheader {
    font-weight: bold;
    margin-bottom: 16px;
  }

  .info {
    margin-bottom: 4px;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .button {
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }

  .button:hover {
    color: #8F2855;
  }

  .button span {
    font-size: 18px;
  }

  .arrow {
    font-size: 20px;
  }

  @media (max-width: 600px) {
    .container {
      padding: 8px;
    }

    .button {
      padding: 8px;
    }

    .arrow {
      font-size: 18px;
    }
  }
</style>

<div class="container">
  <div class="section">
    <div class="header">{patient.first_name} {patient.last_name}</div>
    <div class="info">DoB: {new Date(patient.date_of_birth).toLocaleDateString('en-GB')}</div>
    <div class="info">NHS Number: {patient.nhs_number}</div>
  </div>

  <div class="section">
    <div class="subheader">Contact Details:</div>
    <div class="info">Address:</div>
    <div class="info">{patient.address}</div>
    <div class="info">Phone Number: {patient.phone_number}</div>
    <div class="info">Email: {patient.email}</div>
    <div class="info">Emergency Contact Name: {patient.emergency_contact_name}</div>
    <div class="info">Emergency Contact Phone: {patient.emergency_contact_phone}</div>
  </div>

  <div class="section">
    <div class="subheader">Medical Information:</div>
    <div class="buttons">
      <button class="button" on:click={() => navigateTo('view-appointments')}>
        <span>Upcoming and past appointments</span>
        <span>{counts.appointments} <span class="arrow">→</span></span>
      </button>
      <button class="button" on:click={() => navigateTo('my-referrals')}>
        <span>Referrals</span>
        <span>{counts.referrals} <span class="arrow">→</span></span>
      </button>
      <button class="button" on:click={() => navigateTo('my-prescriptions')}>
        <span>Prescriptions</span>
        <span>{counts.prescriptions} <span class="arrow">→</span></span>
      </button>
    </div>
  </div>
</div>
