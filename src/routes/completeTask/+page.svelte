<script>
    let task = {
        id: '0000',
        type: 'REFERRAL',
        description: 'Dr. Williams has requested a follow-up X-ray. Please refer the patient to the X-ray department for a scan.',
        relatedTo: { name: 'Jane Doe', role: 'PATIENT' },
        providerNotes: '',
        status: 'Incomplete' 
    };

    function completeTask() {
        task.status = 'Complete'; 
        console.log(`Task ID ${task.id} is ${task.status}.`);
        
    }
</script>

<style>

    * {
        box-sizing: border-box;
    }

    .container {
        padding: 1rem;
        background: #fff;
        margin: auto;
        width: 100%; 
        max-width: 100vw; 
        box-sizing: border-box; 
    }

    .task-info {
        margin-bottom: 1rem;
    }


    .label {
        font-weight: bold;
        display: block;
        margin-bottom: 0.5rem;
    }

    .value {
        margin-bottom: 1rem;
        padding: 0.5rem;
        background: #f9f9f9;
        border: 1px solid #ccc;
    
    }

    .button {
        padding: 1rem;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1rem;
        display: block;
        width: auto;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
    }

    textarea {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-bottom: 1rem;
        width: 100%;
    }


</style>

<div class="container">
    <div class="task-info">
        <span class="label">ID:</span>
        <span class="value">{task.id}</span>
    </div>
    <div class="task-info">
        <span class="label">Status:</span>
        <span class="value">{task.status}</span>
    </div>
    <div class="task-info">
        <span class="label">Task type:</span>
        <span class="value">{task.type}</span>
    </div>
    <div class="task-info">
        <span class="label">Description:</span>
        <p class="value">{task.description}</p>
    </div>
    <div class="task-info">
        <span class="label">Related to:</span>
        <span class="value">{task.relatedTo.name} ({task.relatedTo.role})</span>
    </div>
    <div class="task-info">
        <label class="label" for="providerNotes">Provider Notes:</label>
        <textarea id="providerNotes" bind:value={task.providerNotes}></textarea>
    </div>
    <div class="button-container">
        <button class="button" on:click={completeTask}>COMPLETE</button>
    </div>
</div>
