<script lang="ts">
  export let title: string;
  export let filenames: string[];
  export let onClick: (filename: string) => void;
  export let expanded = false;

  $: iconName = expanded ? "down" : "right";
</script>

<div>
  <button
    class="px-2 h-8 flex items-center gap-2 w-full bg-gray-300 dark:bg-gray-950"
    on:click={() => (expanded = !expanded)}
  >
    <img src="./assets/chevron-{iconName}.svg" class="svg w-4" alt="Chevron" />
    <h4 class="text-subtle font-bold text-xs uppercase">{title}</h4>
  </button>
  {#if expanded}
    {#each filenames as filename, key (key)}
      <button
        class="pl-8 h-8 flex items-center w-full hover:bg-gray-200 hover:dark:bg-gray-800"
        on:click={() => onClick(filename)}
      >
        <h4 class="text-sm">{filename}</h4>
      </button>
    {/each}
  {/if}
</div>
