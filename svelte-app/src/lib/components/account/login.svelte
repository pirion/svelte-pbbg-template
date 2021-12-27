<script>
import { browser } from "$app/env";

let username = "test1234";
let password = "test1234";

let authenticate = async() => {
	let result = await fetch('/server/auth/login', {method: "POST",headers: {'Content-Type': 'application/json'},body: JSON.stringify({username: username, password: password})});
	if(browser && result.status == 200) {
		window.location = window.origin;
	}
}
</script>


<main>
    <form>
        <label for='username'>Username:</label> <input type='text' placeholder="Username" bind:value={username}/>
        <label for='password'>Password:</label> <input type='password' placeholder="Password" bind:value={password} />
        <button on:click="{authenticate}">Login</button>
    </form>
</main>