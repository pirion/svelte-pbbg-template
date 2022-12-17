<script>
</script>

<style>
</style>


<div>
    <p>Build your app!</p>

    
    <p>The count is {JSON.stringify($ServerState)}.</p>
    <button on:click="{ServerStateStore.stateUpdate}">Update State Manually</button>
</div>