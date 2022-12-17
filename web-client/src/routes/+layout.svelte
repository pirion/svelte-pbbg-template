<script>
    export let data;

    // features imported
    import { onMount, onDestroy } from 'svelte';
    import { GameState, GameStore } from '$lib/stores/GameState';
    import { ServerState, ServerStateStore } from '$lib/stores/ServerState';

    // components
    import Authentication from '$lib/components/account/Authentication.svelte';
    import Loader from '$lib/components/widgets/Loader.svelte';
    
    //hooks
    onMount(async () => {
        GameStore.onMount(data.context);
    });

    onDestroy(async () => {
        GameStore.onDestory();
    });

    export function load() {
        console.log('test')
    }
</script>

<style>
    #container {
        min-width: 0px !important;
    }

    header {
        height: 54px;
    }

    #main {
        display: flex;
        flex: 1;
        flex-grow: 1;
        background-color: gainsboro;
    }

    #main > #container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    #main > #container > * {
        padding: 2px;
        margin: 5px;
    }

    #content {
        width: 100%;
        flex: 1 0 auto;
    }

    footer {
        background-color: rgb(63, 42, 42);
        border-top: 1px solid rgb(17, 17, 78);
        flex: 0;
    }

    footer {
        background-color: rgb(63, 42, 42);
        border-top: 1px solid rgb(17, 17, 78);
        flex: 0;
    }

    .fill-height {
        min-height: 100%;
        height:auto !important; /* cross-browser */
        height: 100%; /* cross-browser */
    }

    ul.menu {
        margin: 0px;
        display: flex;
        background-color: rgb(63, 42, 42);
        border-bottom: 1px solid rgb(17, 17, 78);
        list-style-type:none;
        height: 100%;
    }
</style>



<header>
    <ul class="menu">
        {#if data.context.authenticated}
            <!-- only show if logged in -->
            <li><a href="/">Home</a></li>
            <li><a href="/server/auth/logout">Logout</a></li>
        {/if}
    </ul>
</header>
<div id="main">
    <div id="container" class="container-fluid fill-height">
        {#if !data.context.authenticated}
            <Authentication />
        {:else if $GameState.state == 'LOADING'}
            <Loader />
        {:else}
            <div id="content" class="">
                <slot />
            </div>    
        {/if}    
    </div>
</div>
<footer>Page Footer</footer>