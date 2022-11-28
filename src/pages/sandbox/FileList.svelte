<script lang="ts">
  export let expanded = false;
  export let title: string;
  export let filenames: string[];
  export let onClick: (filename: string) => void;
  export let onDelete: (filenames: string[]) => void;
  export let onAdd: () => void;

  let isEditing = false;

  $: iconName = expanded ? "down" : "right";

  function handleDelete() {
    onDelete(filenames); // FIXME: find ones that are checked
    isEditing = false;
  }
</script>

<div>
  <div
    class="px-2 h-8 flex items-center justify-between w-full bg-gray-300 dark:bg-gray-950"
  >
    <button
      class="flex items-center gap-2 w-full"
      on:click={() => (expanded = !expanded)}
    >
      <img
        src="./assets/chevron-{iconName}.svg"
        class="svg h-4"
        alt="Chevron"
      />
      <h4 class="text-subtle font-bold text-xs uppercase">{title}</h4>
    </button>
    <div class="flex items-center gap-2">
      {#if isEditing}
        <button on:click={handleDelete}>
          <img src="./assets/trash.svg" alt="Delete" class="svg-danger h-4" />
        </button>
        <button on:click={() => (isEditing = false)}>
          <img src="./assets/x.svg" alt="Close" class="svg h-4" />
        </button>
      {:else}
        <button on:click={() => (isEditing = true)}>
          <img src="./assets/pencil.svg" alt="Edit" class="svg h-4" />
        </button>
        <button on:click={onAdd}>
          <img src="./assets/plus.svg" alt="New" class="svg h-5" />
        </button>
      {/if}
    </div>
  </div>
  {#if expanded}
    {#if filenames.length === 0}
      <div class="pl-8 h-8 flex items-center">
        <p class="text-sm text-subtle">No files found</p>
      </div>
    {:else}
      {#each filenames as filename, key (key)}
        <button
          class="pl-8 h-8 flex items-center w-full hover:bg-gray-200 hover:dark:bg-gray-800"
          on:click={() => onClick(filename)}
        >
          <h4 class="text-sm">{filename}</h4>
        </button>
      {/each}
    {/if}
  {/if}
</div>
