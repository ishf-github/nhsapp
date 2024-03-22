<script>
    import Button from "../components/Button.svelte"
    const handleClick=()=>{
        alert("Button clicked")
    } 
    
    </script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<a href="/patients">Go to patients</a>
<Button></Button>