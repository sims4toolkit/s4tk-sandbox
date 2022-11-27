<script lang="ts">
  import type { EditorView } from "codemirror";
  import TextEditor from "src/components/elements/TextEditor.svelte";
  import HorizontalSplitView from "src/components/layout/HorizontalSplitView.svelte";
  import Modal from "src/components/layout/Modal.svelte";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";
  import { loadApi, S4TK_API_STATE, S4TK_API_VERSIONS } from "src/lib/s4tk-api";
  import { runScript } from "src/lib/script-runner";
  import ConsolePanel from "src/pages/sandbox/ConsolePanel.svelte";

  let running = false;
  let output: string = "";
  let editor: EditorView;
  let selectedVersionIndex = 0; // TODO: find index of last API version
  let apiLoaded = false;

  let currentConsoleTab: any;

  let showVersionDetails = false;

  async function runEditorScript() {
    running = true;
    output = "Running...";
    const outputLines: string[] = [];
    runScript(editor.state.doc.toJSON().join("\n"), outputLines);
    output = outputLines.join("\n");
    running = false;
  }

  async function refreshS4TK() {
    apiLoaded = false;

    const version = S4TK_API_VERSIONS[selectedVersionIndex];

    loadApi(version)
      .then((result) => {
        apiLoaded = result;
      })
      .catch((err) => {
        alert(
          `Something went wrong while fetching API v${version}. Reload the page to try again.`
        );

        console.error(err);
      });
  }

  $: {
    selectedVersionIndex;
    refreshS4TK();
  }
</script>

<svelte:head>
  <title>Sandbox</title>
</svelte:head>

<div class="fixed top-10 left-0 right-0 bottom-0 dark:bg-gray-900">
  <VerticalSplitView leftPanelName="File Manager">
    <div slot="left" class="p-2 absolute left-0 right-0 top-0 bottom-0">
      <div class="flex row items-center justify-between gap-2 mb-2">
        <p class="text-sm">API Version:</p>
        <select
          name="s4tk-version-select"
          bind:value={selectedVersionIndex}
          class="block w-full h-6 min-w-fit pl-2 pr-8 rounded text-sm bg-transparent border border-gray-600 dark:border-gray-700"
        >
          {#each S4TK_API_VERSIONS as version, key (key)}
            <option value={key}>{version}</option>
          {/each}
        </select>
        <button
          class="text-accent-secondary-light dark:text-accent-secondary-dark underline underline-offset-2 text-sm"
          on:click={() => (showVersionDetails = true)}>Details</button
        >
      </div>
      {#if apiLoaded}
        <p class="text-subtle text-xs">API loaded successfully</p>
      {:else}
        <p class="text-xs text-red-700 dark:text-red-500">API has not loaded</p>
      {/if}
    </div>
    <div
      slot="right"
      class="absolute left-0 right-0 top-0 bottom-0 dark:bg-gray-800"
    >
      <HorizontalSplitView bottomPanelName={currentConsoleTab}>
        <div slot="top">
          <TextEditor bind:editor />
        </div>
        <ConsolePanel
          slot="bottom"
          bind:output
          bind:currentTab={currentConsoleTab}
        />
      </HorizontalSplitView>
    </div>
  </VerticalSplitView>
</div>

<button
  on:click={runEditorScript}
  title="Run"
  class="fixed right-4 bottom-4 h-10 w-10 flex items-center justify-center rounded-full bg-secondary drop-shadow-md z-10"
  disabled={running}
>
  <img src="./assets/play.svg" class="svg-invert h-6" alt=">" />
</button>

{#if showVersionDetails}
  <Modal
    title="API Version {S4TK_API_VERSIONS[selectedVersionIndex]}"
    onClose={() => (showVersionDetails = false)}
  >
    <div>
      <ul>
        {#each S4TK_API_STATE.specs as vd, key (key)}
          <li class="text-sm mb-1">
            {vd.name}:
            <a
              class="monospace text-secondary"
              href="https://sims4toolkit.com/#/docs/{vd.name.replace(
                '@s4tk/',
                ''
              )}/{vd.version}"
              target="_blank">{vd.version}</a
            >
          </li>
        {/each}
      </ul>
      <p class="text-subtle text-xs mt-2">
        To view the relevant docs, click the<br />version numbers.
      </p>
    </div>
  </Modal>
{/if}
