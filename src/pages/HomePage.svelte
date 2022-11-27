<script lang="ts">
  import TextEditor from "src/components/elements/TextEditor.svelte";
  import HorizontalSplitView from "src/components/layout/HorizontalSplitView.svelte";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";

  let sourceCode: string = "";
  let output: string = "";
  const placeholderText = "const { Package } = window.S4TK.models;";

  let selectedVersionIndex = 0;

  const versions = ["0.1.0"];

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

  async function fetchS4TK(version: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      // FIXME: cache with indexed DB, not local storage

      const storageKey = `s4tk-api-${version}`;
      const cached = localStorage.getItem(storageKey);

      if (cached) return resolve(cached);

      fetch(
        `https://raw.githubusercontent.com/sims4toolkit/browserfied/version/${version}/build/s4tk.min.js`
      )
        .then((res) => {
          res.text().then((text) => {
            localStorage.setItem(storageKey, text);
            resolve(text);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  $: {
    // FIXME: reload page when new version selected
    fetchS4TK(versions[selectedVersionIndex]).then((s4tk) => eval(s4tk));
  }
</script>

<svelte:head>
  <title>Sandbox</title>
</svelte:head>

<div class="fixed top-10 left-0 right-0 bottom-0 dark:bg-gray-900">
  <VerticalSplitView leftPanelName="File Manager">
    <div slot="left" class="p-2 absolute left-0 right-0 top-0 bottom-0">
      <div class="flex row items-center justify-between gap-2">
        <p class="text-sm">API Version:</p>
        <select
          name="s4tk-version-select"
          bind:value={selectedVersionIndex}
          class="block w-full h-6 min-w-fit pl-2 pr-8 rounded text-sm bg-transparent border border-gray-600 dark:border-gray-700"
        >
          {#each versions as version, key (key)}
            <option value={key}>{version}</option>
          {/each}
        </select>
        <button
          class="text-accent-secondary-light dark:text-accent-secondary-dark underline underline-offset-2 text-sm"
          >Details</button
        >
      </div>
    </div>
    <div
      slot="right"
      class="absolute left-0 right-0 top-0 bottom-0 dark:bg-gray-800"
    >
      <HorizontalSplitView bottomPanelName="Output">
        <div slot="top">
          <!-- <textarea
            bind:value={sourceCode}
            class="w-full min-h-full p-2 monospace bg-transparent"
            placeholder={placeholderText}
          /> -->
          <TextEditor />
        </div>
        <div slot="bottom" class="p-2">
          <h4
            class="text-sm text-subtle underline underline-offset-4 select-none"
          >
            Output
          </h4>
          <p class="text-sm monospace mt-2 whitespace-pre-wrap">
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

<!-- <style lang="scss">
  textarea {
    color: var(--color-text);

    &::placeholder {
      color: var(--color-text-subtle);
    }
  }
</style> -->
