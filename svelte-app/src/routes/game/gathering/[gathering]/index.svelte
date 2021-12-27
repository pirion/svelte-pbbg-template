<script>
    import { page } from '$app/stores';
    import { GameStore, actions, user } from '$lib/stores/game';

    let gatheringName = $page.params.gathering;
    let gatheringProperName = $page.params.gathering[0].toUpperCase()+$page.params.gathering.substring(1);
    let selectedType = "";
    $: gatheringLevel = $user && $user.levels && $user.levels[$page.params.gathering] ? $user.levels[$page.params.gathering] : 0;

    function doSendAction() {
        GameStore.sendAction(gatheringName, selectedType);
    }
</script>


<p>Welcome to the {gatheringProperName} page.</p>

<p>{gatheringProperName} level: {gatheringLevel}</p>

{#if gatheringName && $actions && $actions.gathering}
    <select bind:value={selectedType}>
        {#each $actions.gathering[gatheringName] as selection}
            {#if selection.level <= gatheringLevel}
                <option>{selection.name}</option>
            {/if}
        {/each}
    </select>
    <button on:click="{doSendAction}">Go</button>
{/if}

<p>{JSON.stringify($actions)}</p>

