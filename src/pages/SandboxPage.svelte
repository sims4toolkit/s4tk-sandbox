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

<VerticalSplitView leftPanelName="Files">
  <div slot="left" class="dark:bg-gray-700 h-full">Files Content</div>
  <HorizontalSplitView bottomPanelName="Output" slot="right">
    <div class="p-4" slot="top">
      <textarea
        bind:value={sourceCode}
        class="w-full p-4 monospace bg-gray-200 dark:bg-gray-900"
        placeholder={placeholderText}
      />
    </div>
    <div slot="bottom" class="dark:bg-gray-700 w-full h-full">
      <p>{output}</p>
    </div>
  </HorizontalSplitView>
</VerticalSplitView>

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
