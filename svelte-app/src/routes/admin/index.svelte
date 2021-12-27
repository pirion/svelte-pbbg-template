<script>
import { each } from 'svelte/internal';
import { messages } from '$lib/stores/chat';
</script>

{#each $messages as message}
<p>{message.user.username}: {message.content}</p>
{/each}