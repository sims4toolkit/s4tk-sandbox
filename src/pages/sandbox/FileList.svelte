<script lang="ts">
  import type FileManager from "src/lib/file-manager";

  export let expanded = false;
  export let title: string;
  export let fileManager: FileManager;
  export let onFileClick: (filename: string, content: string) => void;

  let isEditing = false;
  let checkedFilenames = new Set<string>();
  let filenames = fileManager.filenames;

  $: iconName = expanded ? "down" : "right";

  $: {
    if (!isEditing) checkedFilenames.clear();
  }

  async function handleAdd() {
    let filename = prompt("Enter unique name for new file");
    if (!filename) return;
    filename = filename.trim();
    if (fileManager.hasFile(filename)) {
      if (confirm(`Filename '${filename}' is taken. Try again?`)) {
        handleAdd();
      }
    } else {
      await fileManager.tryAdd(filename, "");
      filenames = fileManager.filenames;
    }
  }

  async function handleClick(filename: string) {
    if (isEditing) {
      if (checkedFilenames.has(filename)) {
        checkedFilenames.delete(filename);
      } else {
        checkedFilenames.add(filename);
      }

      checkedFilenames = checkedFilenames;
    } else {
      fileManager
        .getFileContent(filename)
        .then((content) => onFileClick(filename, content));
    }
  }

  async function handleDelete() {
    const toDelete = [...checkedFilenames];

    const message = `Are you sure you want to delete the following files?\n\n${toDelete}`;

    if (confirm(message)) {
      await fileManager.tryDelete(...toDelete);
      filenames = fileManager.filenames;
    }

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
        <button on:click={handleAdd}>
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
          class="pl-8 h-8 flex items-center gap-2 w-full hover:bg-gray-200 hover:dark:bg-gray-800"
          on:click={() => handleClick(filename)}
        >
          {#if isEditing}
            {#if checkedFilenames.has(filename)}
              <img
                src="./assets/checkmark-circle.svg"
                class="svg-danger h-5"
                alt="Checked"
              />
            {:else}
              <img
                src="./assets/checkmark-circle-outline.svg"
                class="svg h-5"
                alt="Not Checked"
              />
            {/if}
          {/if}
          <h4 class="text-sm">{filename}</h4>
        </button>
      {/each}
    {/if}
  {/if}
</div>
