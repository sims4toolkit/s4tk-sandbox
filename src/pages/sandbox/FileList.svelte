<script lang="ts">
  import type FileManager from "src/lib/file-manager";

  export let expanded = false;
  export let highlightedFilename: string = null;
  export let title: string;
  export let fileManager: FileManager;
  export let onFileClick: (filename: string) => void;
  export let onFilesDeleted: (filenames: string[]) => void = () => {};

  let isEditing = false;
  let checkedFilenames = new Set<string>();
  let filenames = fileManager.filenames;

  $: chevronIcon = expanded ? "down" : "right";

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
      onFileClick(filename);
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
    } else if (filename !== highlightedFilename) {
      onFileClick(filename);
    }
  }

  async function handleDelete() {
    if (checkedFilenames.size === 0) return;

    const toDelete = [...checkedFilenames];

    const message = `Are you sure you want to delete the following files?\n\n${toDelete.join(
      ", "
    )}`;

    if (confirm(message)) {
      await fileManager.tryDelete(...toDelete);
      filenames = fileManager.filenames;
      onFilesDeleted(toDelete);
    }

    isEditing = false;
  }

  async function handleRename() {
    if (checkedFilenames.size === 0) return;
    else if (checkedFilenames.size > 1) {
      alert(
        "Only one file can be renamed at a time. Uncheck all but one and try again."
      );
      return;
    }

    const oldName = [...checkedFilenames][0];

    let newName = prompt(`Enter new name for file '${oldName}'`);
    if (!newName) return;
    newName = newName.trim();

    if (fileManager.hasFile(newName)) {
      if (confirm(`Filename '${newName}' is taken. Try again?`)) {
        handleRename();
      }
    } else {
      await fileManager.tryRename(oldName, newName);
      filenames = fileManager.filenames;
      onFileClick(newName);
    }

    isEditing = false;
  }
</script>

<div>
  <div
    class="px-2 h-8 flex items-center gap-4 justify-between w-full bg-gray-300 dark:bg-gray-950 min-w-fit"
  >
    <button
      class="flex items-center gap-2 w-full min-w-fit"
      on:click={() => (expanded = !expanded)}
    >
      <img
        src="./assets/chevron-{chevronIcon}.svg"
        class="svg h-4"
        alt="Chevron"
      />
      <h4 class="text-subtle font-bold text-xs uppercase">{title}</h4>
    </button>
    <div class="flex items-center gap-2 min-w-fit">
      {#if isEditing}
        <button on:click={handleDelete}>
          <img src="./assets/trash.svg" alt="Delete" class="svg-danger h-4" />
        </button>
        <button on:click={handleRename}>
          <img src="./assets/text-outline.svg" alt="Rename" class="svg h-4" />
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
          class="pl-8 h-8 flex items-center gap-2 w-full hover:bg-gray-200 hover:dark:bg-gray-700"
          class:bg-gray-200={highlightedFilename === filename}
          class:dark:bg-gray-800={highlightedFilename === filename}
          on:click={() => handleClick(filename)}
        >
          {#if isEditing}
            {#if checkedFilenames.has(filename)}
              <img
                src="./assets/checkmark-circle.svg"
                class="svg-accent h-5"
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
