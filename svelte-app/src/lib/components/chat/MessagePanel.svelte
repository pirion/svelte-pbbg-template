<script>
import Message from '$lib/components/chat/Message.svelte';
import {ChatStore, messages} from '$lib/stores/chat'

function doChatAction(){
    ChatStore.sendMessage('general', 'test');
}
</script>

{#each $messages as message}
<Message username={message.user.username} content={message.content} />
{/each}

<button on:click="{doChatAction}">TestChat</button>