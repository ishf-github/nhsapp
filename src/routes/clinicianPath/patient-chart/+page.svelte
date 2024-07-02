<script>
    import { onMount } from 'svelte';
    import { supabase } from '../../../supabaseClient';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
  
    let patient = {
      firstName: '',
      lastName: '',
      dob: '',
      sex: '',
      nhsNumber: '',
      address: '',
      email: '',
      phone: '',
      emergencyContactName: '',
      emergencyContactPhone: ''
    };
  
    let currentUser = null;
    let patientId = null;
  
    async function fetchPatientDetails(pid) {
      const { data, error } = await supabase
        .from('patients')
        .select('patient_id, first_name, last_name, date_of_birth, sex, nhs_number, address, phone_number, email, emergency_contact_name, emergency_contact_phone')
        .eq('patient_id', pid)
        .single();
  
      if (error) {
        console.error('Error fetching patient details:', error);
      } else {
        patient = {
          firstName: data.first_name,
          lastName: data.last_name,
          dob: data.date_of_birth,
          sex: data.sex,
          nhsNumber: data.nhs_number,
          address: data.address,
          email: data.email,
          phone: data.phone_number,
          emergencyContactName: data.emergency_contact_name,
          emergencyContactPhone: data.emergency_contact_phone
        };
        patientId = data.patient_id;
        console.log('Fetched patient ID:', patientId);
      }
    }
  
    async function fetchCurrentUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;
        console.log('Fetched user ID:', currentUser.id);
      }
    }
  
    $: {
      const params = new URLSearchParams($page.url.search);
      const pid = params.get('patientId');
      if (pid) {
        fetchPatientDetails(pid);
        fetchCurrentUser();
      }
    }
  
    async function sendMessage() {
      if (!currentUser || !patientId) {
        console.error('User or patient not properly loaded');
        console.log('Current user:', currentUser);
        console.log('Patient ID:', patientId);
        return;
      }
  
      const { data: clinician, error: clinicianError } = await supabase
        .from('clinicians')
        .select('clinician_id')
        .eq('clinician_id', currentUser.id)
        .single();
  
      if (clinicianError) {
        console.error('Error fetching clinician details:', clinicianError);
        return;
      }
  
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('patient_id')
        .eq('patient_id', patientId)
        .single();
  
      if (patientError) {
        console.error('Error fetching patient details:', patientError);
        return;
      }
  
      console.log('Clinician ID:', clinician.clinician_id);
      console.log('Patient ID:', patient.patient_id);
  
      const url = `/message-patient?receiverId=${patient.patient_id}&senderId=${clinician.clinician_id}`;
      window.open(url, '_blank', 'width=800,height=600,noopener,noreferrer');
    }
  
    function navigateTo(page) {
      goto(page);
    }
  </script>
  
  <style>
    .icon-button {
      width: 150px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      background-color: #005EB8;
      color: white;
      font-family: 'Frutiger', sans-serif;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      border: none;
      border-radius: 4px;
      text-align: center;
      text-transform: capitalize;
      margin-bottom: 20px;
    }
  
    .patient-chart-page {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
  
    .patient-name {
      font-family: 'Frutiger', sans-serif;
      font-weight: bold;
      font-size: 2rem;
    }
  
    h2 {
      font-family: 'Frutiger', sans-serif;
    }
  
    p, pre {
      font-family: Arial, sans-serif;
    }
  
    .notes-button {
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
      background-color: #005EB8;
      color: white;
      font-family: 'Frutiger', sans-serif;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  </style>
  
  <div class="patient-chart-page">
    <button class="icon-button send-message-button" on:click={sendMessage}>Send Message</button>
  
    <section class="patient-details">
      <h1 class="patient-name">{patient.firstName} {patient.lastName}</h1>
      <p>Date of Birth: {patient.dob}</p>
      <p>Sex: {patient.sex}</p>
      <p>NHS Number: {patient.nhsNumber}</p>
    </section>
  
    <section class="contact-details">
      <h2>Contact Details:</h2>
      <p>Address:</p>
      <pre>{patient.address}</pre>
      <p>Email: {patient.email}</p>
      <p>Phone: {patient.phone}</p>
    </section>
  
    <section class="emergency-contact">
      <h2>Emergency Contact:</h2>
      <p>Name: {patient.emergencyContactName}</p>
      <p>Phone: {patient.emergencyContactPhone}</p>
    </section>
  </div>
  