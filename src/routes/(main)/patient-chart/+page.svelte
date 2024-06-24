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

    async function fetchPatientDetails(patientId) {
        const { data, error } = await supabase
            .from('patients')
            .select('first_name, last_name, date_of_birth, sex, nhs_number, address, phone_number, email, emergency_contact_name, emergency_contact_phone')
            .eq('patient_id', patientId)
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
        }
    }

    $: {
        const params = new URLSearchParams($page.url.search);
        const patientId = params.get('patientId');
        if (patientId) {
            fetchPatientDetails(patientId);
        }
    }

    function editPatientDetails() { /* ... */ }
    function printPatientChart() { /* ... */ }
    function savePatientChartAsPDF() { /* ... */ }
    function bookAppointment() { /* ... */ }
    function viewMessages() { /* ... */ }
</script>

<style>
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

    .messages-round {
        position: fixed;
        bottom: 64px; 
        right: 96px; 
        z-index: 30; 
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        background-color: #808080; 
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    .patient-name {
        font-weight: bold;
    }
</style>

<div class="patient-chart-page">
    
    <header>
        <button on:click={editPatientDetails}>EDIT</button>
        <div class="logo">LOGO</div>
        <div>
            <button on:click={savePatientChartAsPDF}>PDF</button>
            <button on:click={printPatientChart}>PRINT</button>
        </div>
    </header>

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

    <footer>
        <button class="icon-button messages-round" on:click={() => navigateTo('messages')}>MESSAGE</button>
        <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>
    </footer>
</div>
