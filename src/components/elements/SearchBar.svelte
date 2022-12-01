<script lang="ts">
  export let searchQuery: string;
</script>

<div
  class="flex py-1 items-center border border-solid border-gray-700 dark:border-gray-300 rounded"
>
  <input
    type="text"
    class="h-8 w-48 ml-1 px-1 bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
    placeholder="Search..."
    bind:value={searchQuery}
  />
  <div class="w-5 mx-2 flex items-center justify-center">
    {#if Boolean(searchQuery)}
      <button on:click={() => (searchQuery = "")}>
        <img src="./assets/x.svg" alt="Clear" class="svg w-5" />
      </button>
    {:else}
      <img src="./assets/search-outline.svg" alt="Search" class="svg w-5" />
    {/if}
  </div>
</div>
