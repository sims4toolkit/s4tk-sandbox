<script lang="ts">
  import DatabaseService from "src/lib/database";
  import { S4TK_API_STATE } from "src/lib/s4tk-api";
  import HelpConsoleContent from "./HelpConsoleContent.svelte";

  export let output: string;
  export let currentTab: "Output" | "Help" | "Settings" = "Output";

  const outputPlaceholder = `Errors and calls to <code class="text-primary">Sandbox.output(...args: string[])</code> will be written here. Asynchronous output might not get written.`;

  async function clearCache() {
    if (
      confirm(
        `This will delete all of the S4TK API versions that have been cached in your browser, and the page with reload and re-fetch the API from the server. Are you sure you want to continue?`
      )
    ) {
      await DatabaseService.clear("api");
      await DatabaseService.clear("api_specs");
      location.reload();
    }
  }

  async function deleteMedia() {
    if (
      confirm(
        `This will delete all of your media files, and there is no way to recover them. Are you sure you want to continue?`
      )
    ) {
      await DatabaseService.clear("media");
      location.reload();
    }
  }

  async function deleteScripts() {
    if (
      confirm(
        `This will delete all of your scripts, and there is no way to recover them. Are you sure you want to continue?`
      )
    ) {
      await DatabaseService.clear("script");
      location.reload();
    }
  }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <div class="flex gap-4 p-2">
    <button
      on:click={() => (currentTab = "Output")}
      disabled={currentTab === "Output"}
    >
      <h4
        class="text-sm underline-offset-4 select-none"
        class:underline={currentTab === "Output"}
        class:text-subtle={currentTab !== "Output"}
      >
        Output
      </h4>
    </button>
    <button
      on:click={() => (currentTab = "Help")}
      disabled={currentTab === "Help"}
    >
      <h4
        class="text-sm underline-offset-4 select-none"
        class:underline={currentTab === "Help"}
        class:text-subtle={currentTab !== "Help"}
      >
        Help
      </h4>
    </button>
    <button
      on:click={() => (currentTab = "Settings")}
      disabled={currentTab === "Settings"}
    >
      <h4
        class="text-sm underline-offset-4 select-none"
        class:underline={currentTab === "Settings"}
        class:text-subtle={currentTab !== "Settings"}
      >
        Settings
      </h4>
    </button>
  </div>

  <div class="p-2 h-full overflow-y-auto">
    {#if currentTab === "Output"}
      <p class="text-sm monospace whitespace-pre-wrap">
        {#if Boolean(output)}
          {output}
        {:else}
          {@html outputPlaceholder}
        {/if}
      </p>
    {:else if currentTab === "Help"}
      <HelpConsoleContent />
    {:else}
      <div class="flex gap-4">
        <button
          class="text-red-600 dark:text-red-500 border border-solid border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-gray-900 px-2 py-1 rounded"
          on:click={deleteScripts}>Delete Scripts</button
        >
        <button
          class="text-red-600 dark:text-red-500 border border-solid border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-gray-900 px-2 py-1 rounded"
          on:click={deleteMedia}>Delete Media</button
        >
        <button
          class="text-red-600 dark:text-red-500 border border-solid border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-gray-900 px-2 py-1 rounded"
          on:click={clearCache}>Clear Cache</button
        >
      </div>
    {/if}
  </div>
</div>
