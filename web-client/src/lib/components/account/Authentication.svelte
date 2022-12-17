<script>
import { browser } from "$app/environment";

import Register from '$lib/components/account/register.svelte';
import Login from '$lib/components/account/login.svelte';

let register = 0
let authError = null;

function toggleActiveForm() {
    register = !register;
    return false;
}

let authenticate = async() => {
    authError = null
	let result = await fetch('/server/auth/register', {method: "POST",headers: {'Content-Type': 'application/json'},body: JSON.stringify({username: 'GUEST', password: 'GUEST'})});
    if(browser) {
        if(result.status == 200) {
            window.location = window.origin;
        }
        else {
            try {
                let resultBody = await result.json();
                authError = resultBody.message;
            }
            catch {
                authError = 'Unspecified Error'
            }
        }
    }
}
</script>

<style>
    main {
        width: 400px;
    }
    .btn-size {
        width: 200px !important;
    }

    .bold-text {
        font-weight: bold !important;
    }
</style>

<main class="pt-3 pb-3 mx-auto text-center">

    <div class="row my-2">
        <div class="col">
            <h3 class="bold-text">My App Authentication</h3>
        </div>      
    </div>

    <div class="row my-2">
        <div class="col">
            <a href='/server/auth/discord' class="btn btn-primary btn-size" ><i class="fa-brands fa-discord"></i><span class="px-2">Discord Login</span></a>
        </div>      
    </div>

    <hr />

    {#if register}
    <div class="row mt-2">   
        <div class="col">
        <Register />
        </div>
    </div>

        {#if authError}
        <div class="row my-2">
            <div class="col">
                <p class="text-danger">Server Error when registering as a Guest<br />{authError}</p>
            </div>
        </div>
        {/if}

    <div class="row my-2">
        <div class="col">
            <button  class="btn btn-primary btn-size" on:click="{authenticate}">Register as Guest</button>
        </div>
    </div>

    <div class="row my-2">
        <div class="col">
            <a class="btn btn-danger btn-size" href="" on:click="{toggleActiveForm}">Return to Login</a>
        </div>
    </div>
            
    {:else}
    <div class="row my-2">   
        <div class="col">
        <Login />
        </div>
    </div>
    <div class="row my-2">
        <div class="col">
            <a href="" on:click="{toggleActiveForm}">New? Click here to Register</a>
        </div>
    </div>
    
    {/if}       

</main>