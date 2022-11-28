<script lang="ts">
  import Modal from "src/components/layout/Modal.svelte";
  import DatabaseService from "src/lib/database";
  import { onMount } from "svelte";

  export let onClose: () => void;
  export let filename: string;

  let loadStatus: "loading" | "loaded" | "error" = "loading";
  let fileContent: Buffer;
  let fileSize: number;

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
</script>

<Modal title="Media" {onClose}>
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
      <p class="text-xs text-subtle">{fileSize} bytes</p>
      <div class="flex gap-2 justify-between items-center w-full mt-4">
        <button
          class="flex items-center justify-center gap-2 flex-1 border border-solid border-accent-secondary-light dark:border-accent-secondary-dark hover:bg-accent-secondary-light hover:text-white dark:hover:bg-accent-secondary-dark dark:hover:text-gray-900 px-2 py-1 rounded"
        >
          <img src="./assets/download.svg" class="svg h-5" alt="v" />Download
        </button>
        <button
          class="flex items-center justify-center gap-2 flex-1 border border-solid border-accent-secondary-light dark:border-accent-secondary-dark hover:bg-accent-secondary-light hover:text-white dark:hover:bg-accent-secondary-dark dark:hover:text-gray-900 px-2 py-1 rounded"
        >
          <img src="./assets/upload.svg" class="svg h-5" alt="^" />Upload
        </button>
      </div>
    {/if}
  </div>
</Modal>

<style lang="scss">
  button:hover > img {
    filter: var(--filter-svg-invert);
  }
</style>
