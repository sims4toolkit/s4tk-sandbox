<script lang="ts">
  import FileManager from "src/lib/file-manager";
  import FileList from "src/pages/sandbox/FileList.svelte";
  import { onMount } from "svelte";

  let managersInitialized = false;
  let scriptFileManager: FileManager;
  let mediaFileManager: FileManager;

  onMount(async () => {
    scriptFileManager = await FileManager.initialize("script");
    mediaFileManager = await FileManager.initialize("media");
    managersInitialized = true;
  });

  function handleScriptFileClick(filename: string) {
    alert("script " + filename);
  }

  function handleMediaFileClick(filename: string) {
    alert("media " + filename);
  }
</script>

<div class="h-full overflow-y-auto">
  {#if managersInitialized}
    <FileList
      expanded={true}
      title="Scripts"
      fileManager={scriptFileManager}
      onFileClick={handleScriptFileClick}
    />
    <FileList
      title="Media"
      fileManager={mediaFileManager}
      onFileClick={handleMediaFileClick}
    />
  {:else}
    <p class="ml-2 text-subtle text-sm">Initializing file system...</p>
  {/if}
</div>
