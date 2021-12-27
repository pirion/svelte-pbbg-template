
<script>
    import { session } from '$app/stores';
    import { socket } from '$lib/stores/socket';
    import { onMount, onDestroy } from 'svelte';
    
    import MessagePanel from '$lib/components/chat/MessagePanel.svelte';


    onMount(async () => {
        if($session.user) {
            let connectedSocket = io.connect(`${window.location.origin}`, {path: "/server/socket.io/", transports: ["websocket"], query: {token: $session.token}});
            socket.set(connectedSocket);
            $socket.emit('Test');
        }
    });

    onDestroy(async () => {
        if($socket) {
            $socket.disconnect();
            socket.set(null);
        }
    });
</script>

{#if $session.user}
    <a href="/">Home</a>
    <a href="/game/inventory">Inventory</a>
    {#if $session.user.IsAdministrator}
        <a href="/admin/">Admin</a>
    {/if}
{/if}

<slot></slot>


{#if $session.user}
    <MessagePanel />
{/if}