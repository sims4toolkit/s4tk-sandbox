<script lang="ts">
  import Modal from "src/components/layout/Modal.svelte";
  import FileManager from "src/lib/file-manager";
  import Settings from "src/lib/settings";
  import FileList from "src/pages/sandbox/FileList.svelte";
  import { onMount } from "svelte";
  import MediaModal from "./MediaModal.svelte";

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
    managersInitialized = true;

    if (!Settings.hasSeenExampleScript) {
      await scriptFileManager.tryAdd(
        "helloWorld",
        `const { Package, StringTableResource } = require("@s4tk/models");\nconst { BinaryResourceType } = require("@s4tk/models/enums");\nconst { fnv64 } = require("@s4tk/hashing");\n\nconst pkg = new Package();\nconst stbl = new StringTableResource();\nstbl.addAndHash("Hello world");\n\npkg.add(\n  {\n    type: BinaryResourceType.StringTable,\n    group: 0x80000000,\n    instance: fnv64("creator:SampleStringTable")\n  },\n  stbl\n);\n\nSandbox.output(JSON.stringify(stbl.toJsonObject()));\nSandbox.download("Sample.package", pkg.getBuffer());\n`
      );
      Settings.hasSeenExampleScript = true;
    }

    const firstFilename = scriptFileManager.getFirstFilename();
    if (firstFilename) handleScriptFileClick(firstFilename);
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
