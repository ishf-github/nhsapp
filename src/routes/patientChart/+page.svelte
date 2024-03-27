<script>
    import Button from "../../components/Button.svelte";
    import { goto } from '$app/navigation';
    
    const handleClick = () => {
        alert("Button clicked");
    };

    function handleAction(button) {
      if (button === 'viewMessages') {
        goto('/patientMessages'); // Navigate to the patients route
      }
    }

    // Mock data for the patient's details
    let patient = {
        name: 'NAME SURNAME',
        dob: '01/01/1991',
        nextAppt: '01/01/2025',
        address: 'LINE 1\nLINE 2\nCITY\nCOUNTY\nPOSTCODE',
        email: 'EMAIL@MAIL.COM',
        phone: '07700000000',
        medicalConditions: 'Conditions listed here',
        otherMedicalInfo: 'Other medical information',
        allergies: 'None',
        medicationAllergies: 'None',
        medicationTaken: 'None',
        chemotherapy: 'No',
        mentalState: 'No record of schizophrenia',
        bodyInfo: {
            height: '5ft 7in',
            weight: '72kg',
            disabilities: 'None'
        },
        providerNotes: ''
    };

    // Functions to handle actions like Edit, Print, PDF generation, Book Appointment, and Message
    function editPatientDetails() {
        // Edit patient details logic here
    }

    function printPatientChart() {
        // Print patient chart logic here
    }

    function savePatientChartAsPDF() {
        // Save as PDF logic here
    }

    function bookAppointment() {
        // Booking logic here
    }

    function viewMessages() {
        // View messages logic here
    }
</script>

<style>
    /* Your CSS styles here */
</style>

<div class="patient-chart-page">
    <!-- Header with Edit, PDF, and Print buttons -->
    <header>
        <button on:click={editPatientDetails}>EDIT</button>
        <div class="logo">LOGO</div>
        <div>
            <button on:click={savePatientChartAsPDF}>PDF</button>
            <button on:click={printPatientChart}>PRINT</button>
        </div>
    </header>

    <!-- Patient details section -->
    <section class="patient-details">
        <h1>{patient.name}</h1>
        <p>Dob: {patient.dob}</p>
        {#if patient.nextAppt}
            <p>Next Appt: {patient.nextAppt}</p>
        {:else}
            <button on:click={bookAppointment}>BOOK APPT</button>
        {/if}
    </section>

    <!-- Contact details -->
    <section class="contact-details">
        <h2>Contact Details:</h2>
        <p>Address:</p>
        <pre>{patient.address}</pre>
        <p>Email: {patient.email}</p>
        <p>Phone: {patient.phone}</p>
    </section>

    <!-- Medical Information -->
    <section class="medical-info">
        <h2>Medical Information:</h2>
        <p>Conditions: {patient.medicalConditions}</p>
        <p>Other: {patient.otherMedicalInfo}</p>
    </section>

    <!-- Allergies and Medication -->
    <section class="allergies-medication">
        <p>Allergies: {patient.allergies}</p>
        <p>Medication Allergies: {patient.medicationAllergies}</p>
        <p>Medication Taken: {patient.medicationTaken}</p>
        <p>Chemotherapy: {patient.chemotherapy}</p>
    </section>

    <!-- Mental and Body Information -->
    <section class="mental-body-info">
        <p>Mental State: {patient.mentalState}</p>
        <p>Height: {patient.bodyInfo.height}</p>
        <p>Weight: {patient.bodyInfo.weight}</p>
        <p>Physical Disabilities: {patient.bodyInfo.disabilities}</p>
    </section>

    <!-- Provider Notes -->
    <section class="provider-notes">
        <textarea bind:value={patient.providerNotes} placeholder="Provider Notes"></textarea>
    </section>

    <!-- Footer with round CTA buttons -->
    <footer>
        <button class="round-button" on:click={viewMessages}>MESSAGES</button>
        <button class="round-button" on:click={() => {}}>NOTES</button>
        <!-- Include other footer content or navigation buttons -->
    </footer>
</div>
