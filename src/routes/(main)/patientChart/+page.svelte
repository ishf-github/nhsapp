<script>
    import Button from "../../../components/Button.svelte";
    import { goto } from '$app/navigation';
    
    const handleClick = () => {
        alert("Button clicked");
    };

    function handleAction(button) {
      if (button === 'viewMessages') {
        goto('/patientMessages'); 
      }
    }

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

    function editPatientDetails() {
        
    }

    function printPatientChart() {
        
    }

    function savePatientChartAsPDF() {
        
    }

    function bookAppointment() {
        
    }

    function viewMessages() {
        
    }
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
        <h1>{patient.name}</h1>
        <p>Dob: {patient.dob}</p>
        {#if patient.nextAppt}
            <p>Next Appt: {patient.nextAppt}</p>
        {:else}
            <button on:click={bookAppointment}>BOOK APPT</button>
        {/if}
    </section>

   
    <section class="contact-details">
        <h2>Contact Details:</h2>
        <p>Address:</p>
        <pre>{patient.address}</pre>
        <p>Email: {patient.email}</p>
        <p>Phone: {patient.phone}</p>
    </section>

    
    <section class="medical-info">
        <h2>Medical Information:</h2>
        <p>Conditions: {patient.medicalConditions}</p>
        <p>Other: {patient.otherMedicalInfo}</p>
    </section>

    
    <section class="allergies-medication">
        <p>Allergies: {patient.allergies}</p>
        <p>Medication Allergies: {patient.medicationAllergies}</p>
        <p>Medication Taken: {patient.medicationTaken}</p>
        <p>Chemotherapy: {patient.chemotherapy}</p>
    </section>

   
    <section class="mental-body-info">
        <p>Mental State: {patient.mentalState}</p>
        <p>Height: {patient.bodyInfo.height}</p>
        <p>Weight: {patient.bodyInfo.weight}</p>
        <p>Physical Disabilities: {patient.bodyInfo.disabilities}</p>
    </section>

    
    <section class="provider-notes">
        <textarea bind:value={patient.providerNotes} placeholder="Provider Notes"></textarea>
    </section>

    
    <footer>
        <button class="icon-button messages-round" on:click={() => navigateTo('messages')}>MESSAGE</button>
        <button class="icon-button icon-round" on:click={() => navigateTo('notes')}>NOTES</button>
        
    </footer>
</div>
