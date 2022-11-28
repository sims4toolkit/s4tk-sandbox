<script lang="ts">
  import { saveAs } from "file-saver";
  import Modal from "src/components/layout/Modal.svelte";
  import DatabaseService from "src/lib/database";
  import { onMount } from "svelte";

  export let onClose: () => void;
  export let filename: string;

  let loadStatus: "loading" | "loaded" | "error" = "loading";
  let isUploading = false;
  let fileContent: Buffer;
  let fileSize: number;
  let uploadedFiles: FileList;

  $: {
    if (uploadedFiles && uploadedFiles.length > 0) {
      handleFileUpload(uploadedFiles[0]);
    }
  }

  onMount(async () => {
    const b64 = await DatabaseService.getItem("media", filename);

    if (b64 !== undefined) {
      fileContent = window.NodeJS.Buffer.from(b64, "base64");
      fileSize = fileContent.byteLength;
      loadStatus = "loaded";
    } else {
      loadStatus = "error";
    }
  });

  function handleDownload() {
    saveAs(new Blob([fileContent]), filename);
  }

  function handleClose() {
    if (isUploading) {
      isUploading = false;
    } else {
      onClose();
    }
  }

  async function handleFileUpload(file: File) {
    fileContent = window.NodeJS.Buffer.from(await file.arrayBuffer());
    fileSize = fileContent.byteLength;

    await DatabaseService.setItem(
      "media",
      filename,
      fileContent.toString("base64")
    );

    isUploading = false;
    uploadedFiles = undefined;
  }
</script>

<Modal title="Media" onClose={handleClose}>
  <div class="w-96">
    <h4
      class="text-sm monospace text-primary whitespace-nowrap overflow-hidden text-ellipsis mb-1"
    >
      {filename}
    </h4>
    {#if loadStatus === "error"}
      <p class="text-xs text-subtle">Error</p>
    {:else if loadStatus === "loading"}
      <p class="text-xs text-subtle">Loading...</p>
    {:else}
      <p class="text-xs text-subtle mb-4">{fileSize} bytes</p>
      {#if isUploading}
        <input
          name="media-upload"
          type="file"
          class="w-full flex-1 flex items-center border h-8 rounded hover:cursor-pointer"
          bind:files={uploadedFiles}
        />
      {:else}
        <div class="flex gap-4 justify-between items-center w-full">
          <button
            class="flex items-center justify-center gap-2 flex-1 border border-solid border-accent-secondary-light dark:border-accent-secondary-dark hover:bg-accent-secondary-light hover:text-white dark:hover:bg-accent-secondary-dark dark:hover:text-gray-900 h-8 rounded"
            on:click={handleDownload}
          >
            <img src="./assets/download.svg" class="svg h-5" alt="v" />Download
          </button>
          <button
            class="flex items-center justify-center gap-2 flex-1 border border-solid border-accent-secondary-light dark:border-accent-secondary-dark hover:bg-accent-secondary-light hover:text-white dark:hover:bg-accent-secondary-dark dark:hover:text-gray-900 h-8 rounded"
            on:click={() => (isUploading = true)}
          >
            <img src="./assets/upload.svg" class="svg h-5" alt="^" />Upload
          </button>
        </div>
      {/if}
    {/if}
  </div>
</Modal>

<style lang="scss">
  button:hover > img {
    filter: var(--filter-svg-invert);
  }
</style>
