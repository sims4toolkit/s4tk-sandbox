<script lang="ts">
  export let output: string;
  export let currentTab: "Output" | "Help" = "Output";

  const outputPlaceholder = `Calls to <span class="text-secondary">Sandbox.output(...args)</span> will be written here. For best results, keep your code synchronous.`;
</script>

<div class="flex flex-col h-full overflow-hidden">
  <div class="flex gap-4 px-2 pt-2">
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
      <p>Help</p>
    {/if}
  </div>
</div>
