<script lang="ts">
  import HelpConsoleContent from "src/components/editor/HelpConsoleContent.svelte";
  import SettingsConsoleContent from "src/components/editor/SettingsConsoleContent.svelte";

  export let output: string;
  export let currentTab: "Output" | "Help" | "Settings" = "Output";

  const outputPlaceholder = `Errors and calls to <code class="text-primary">Sandbox.output(...args: string[])</code> will be written here.`;
</script>

<div class="flex flex-col h-full overflow-hidden">
  <div class="flex gap-4 p-2">
    <button
      on:click={() => (currentTab = "Output")}
      disabled={currentTab === "Output"}
    >
      <h4
        class="text-xs underline-offset-8 uppercase select-none"
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
        class="text-xs underline-offset-8 uppercase select-none"
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
        class="text-xs underline-offset-8 uppercase select-none"
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
      <SettingsConsoleContent />
    {/if}
  </div>
</div>
