<script>
import { browser } from "$app/environment";
    
let username = "";
let password = "";
let authError = null;

let authenticate = async() => {
    authError = null
    let result = await fetch('/server/auth/login', {method: "POST",headers: {'Content-Type': 'application/json'},body: JSON.stringify({username: `${username}`, password: `${password}`})});
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
    .bold-text {
        font-weight: bold !important;
    }

    .btn-size {
        width: 200px !important;
    }

</style>


<main>
    <div class="bold-text">Login</div>

    {#if authError}
    <div class="row my-2">
        <div class="col">
            <p class="text-danger">Error<br />{authError}</p>
        </div>
    </div>
    {/if}

    <div class="form-group input-group my-2">
        <div class="input-group-prepend">
            <div class="input-group-text"><i class="fa-solid fa-user lh-base"></i></div>
        </div>
        <input class="form-control"  type='text' placeholder="Username" bind:value={username}/>
    </div>
    <div class="form-group input-group my-2">
        <div class="input-group-prepend">
            <div class="input-group-text"><i class="fa-solid fa-key lh-base"></i></div>
        </div>
        <input class="form-control" type='password' placeholder="Password" bind:value={password} />
    </div>
    <button class="btn btn-success btn-size" on:click="{authenticate}">Login</button>
</main>