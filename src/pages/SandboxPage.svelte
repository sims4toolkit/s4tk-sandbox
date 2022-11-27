<script lang="ts">
  import HorizontalSplitView from "src/components/layout/HorizontalSplitView.svelte";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";

  let sourceCode: string = "";
  let output: string = "";
  const placeholderText = "const { Package } = window.S4TK.models;";

  //@ts-ignore
  window.Sandbox = {
    output: (content: string) => (output += content + "\n"),
  };

  async function runCode() {
    try {
      output = "";
      const code = `const output = window.Sandbox.output;${sourceCode}`;
      eval(code);
    } catch (err) {
      output = err;
    }
  }
</script>

<svelte:head>
  <title>Sandbox</title>
</svelte:head>

<div class="fixed top-10 left-0 right-0 bottom-0 dark:bg-gray-950">
  <VerticalSplitView leftPanelName="Files">
    <div slot="left" class="absolute left-0 right-0 top-0 bottom-0">
      Files Content
    </div>
    <div
      slot="right"
      class="absolute left-0 right-0 top-0 bottom-0 dark:bg-gray-900"
    >
      <HorizontalSplitView bottomPanelName="Output">
        <div class="p-4" slot="top">
          <textarea
            bind:value={sourceCode}
            class="w-full p-4 monospace bg-gray-200 dark:bg-gray-900"
            placeholder={placeholderText}
          />
        </div>
        <div slot="bottom" class="p-2">
          <h4
            class="text-sm text-subtle underline underline-offset-4 select-none"
          >
            Output
          </h4>
          <p class="text-sm monospace mt-2">
            {#if Boolean(output)}
              {output}
            {:else}
              Use the <span
                class="text-accent-secondary-light dark:text-accent-secondary-dark"
                >output()</span
              > function to show output.
            {/if}
          </p>
        </div>
      </HorizontalSplitView>
    </div>
  </VerticalSplitView>
</div>

<button
  on:click={runCode}
  title="Run"
  class="fixed right-4 bottom-4 h-10 w-10 flex items-center justify-center rounded-full bg-secondary drop-shadow z-40"
>
  <img src="./assets/play.svg" class="svg-invert h-6" alt=">" />
</button>

<style lang="scss">
  textarea {
    color: var(--color-text);

    &::placeholder {
      color: var(--color-text-subtle);
    }
  }
</style>
