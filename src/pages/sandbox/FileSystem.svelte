<script lang="ts">
  import FileManager from "src/lib/file-manager";
  import { setupSamples } from "src/lib/samples-setup";
  import Settings from "src/lib/settings";
  import FileList from "src/pages/sandbox/FileList.svelte";
  import { onMount } from "svelte";
  import MediaModal from "src/pages/sandbox/MediaModal.svelte";

  export let onScriptLoaded: (filename: string, content: string) => void;

  let currentMediaName: string;
  let currentScriptName: string;
  let showMediaModal = false;

  let managersInitialized = false;
  let scriptFileManager: FileManager;
  let mediaFileManager: FileManager;

  onMount(async () => {
    scriptFileManager = await FileManager.initialize("script");
    mediaFileManager = await FileManager.initialize("media");

    if (!Settings.hasSeenExampleScript) {
      await setupSamples();
      Settings.hasSeenExampleScript = true;
    }

    const firstFilename = scriptFileManager.getFirstFilename();
    if (firstFilename) handleScriptFileClick(firstFilename);

    managersInitialized = true;
  });

  async function handleScriptFileClick(filename: string) {
    currentScriptName = filename;
    const content = await scriptFileManager.getFileContent(filename);
    onScriptLoaded(filename, content);
  }

  async function handleScriptFilesDeleted(filenames: string[]) {
    if (filenames.includes(currentScriptName)) {
      const firstFilename = scriptFileManager.getFirstFilename();
      if (firstFilename) {
        handleScriptFileClick(firstFilename);
      } else {
        currentScriptName = undefined;
        onScriptLoaded(undefined, undefined);
      }
    }
  }

  async function handleMediaFileClick(filename: string) {
    currentMediaName = filename;
    showMediaModal = true;
  }
</script>

<div class="h-full overflow-y-auto">
  {#if managersInitialized}
    <FileList
      expanded={true}
      bind:highlightedFilename={currentScriptName}
      title="Scripts"
      fileManager={scriptFileManager}
      onFileClick={handleScriptFileClick}
      onFilesDeleted={handleScriptFilesDeleted}
    />
    <FileList
      expanded={true}
      title="Media"
      fileManager={mediaFileManager}
      onFileClick={handleMediaFileClick}
    />
  {:else}
    <p class="ml-2 text-subtle text-sm">Initializing file system...</p>
  {/if}
</div>

{#if showMediaModal}
  <MediaModal
    filename={currentMediaName}
    onClose={() => (showMediaModal = false)}
  />
{/if}
