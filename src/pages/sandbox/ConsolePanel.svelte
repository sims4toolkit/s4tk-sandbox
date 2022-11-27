<script lang="ts">
  import HelpConsoleContent from "./HelpConsoleContent.svelte";

  export let output: string;
  export let currentTab: "Output" | "Help" = "Output";

  const outputPlaceholder = `Errors and calls to <code class="text-primary">Sandbox.output(...args: string[])</code> will be written here. Asynchronous output might not get written.`;
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
    {:else}
      <HelpConsoleContent />
    {/if}
  </div>
</div>
