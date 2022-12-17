<script>
    import CombatPane from "$lib/components/combat/CombatPane.svelte";
    //import PartySelectionPane from '$lib/components/menu/PartySelectionPane.svelte';


    export function load() {
        console.log('test1')
    }

</script>

<style>
</style>


<div>
    {#if false}
        <!--<PartySelectionPane />-->
    {:else}
        <CombatPane />
    {/if}
</div>