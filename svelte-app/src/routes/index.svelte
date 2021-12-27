<script>
import { browser } from '$app/env';
import { goto } from '$app/navigation';
import Authentication from '$lib/components/account/Authentication.svelte';

if(browser) {
	goto("/game");
}
</script>

<Authentication />