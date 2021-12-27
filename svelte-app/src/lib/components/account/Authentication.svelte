
<script>
import Register from '$lib/components/account/register.svelte';
import Login from '$lib/components/account/login.svelte';
import Recover from '$lib/components/account/recover.svelte';

let register = 0

function toggleActiveForm() {
    register = !register;
    return false;
}
</script>


<main>
    {#if register}
        <a href="." on:click="{toggleActiveForm}">(Login)</a>
        <Register />
    {:else}
        <a href="." on:click="{toggleActiveForm}">(Register)</a>
        <Login />
    {/if}
</main>