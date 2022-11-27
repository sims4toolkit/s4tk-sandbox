<script lang="ts">
  import type { EditorView } from "codemirror";
  import TextEditor from "src/components/elements/TextEditor.svelte";
  import HorizontalSplitView from "src/components/layout/HorizontalSplitView.svelte";
  import Modal from "src/components/layout/Modal.svelte";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";
  import { runScript } from "src/lib/script-runner";
  import ConsolePanel from "./ConsolePanel.svelte";

  let running = false;
  let output: string = "";
  let editor: EditorView;
  let selectedVersionIndex = 0;
  const versions = ["0.1.0"]; // TODO: fetch

  let currentConsoleTab: any;

  let showVersionDetails = false;
  let versionDetails: { name: string; version: string }[];

  async function runEditorScript() {
    running = true;
    output = "Running...";
    const outputLines: string[] = [];
    runScript(editor.state.doc.toJSON().join("\n"), outputLines);
    output = outputLines.join("\n");
    running = false;
  }

  async function fetchS4TK(version: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      // FIXME: cache with indexed DB, not local storage

      const storageKey = `s4tk-api-${version}`;
      const cached = localStorage.getItem(storageKey);

      if (cached) {
        versionDetails = JSON.parse(
          localStorage.getItem(`s4tk-api-details-${version}`)
        );
        resolve(cached);
        return;
      }

      console.log("Fetching...");

      fetch(
        `https://raw.githubusercontent.com/sims4toolkit/browserfied/version/${version}/build/s4tk.specs.json`
      )
        .then((res) => {
          res.text().then((text) => {
            localStorage.setItem(`s4tk-api-details-${version}`, text);
            versionDetails = JSON.parse(
              localStorage.getItem(`s4tk-api-details-${version}`)
            );
          });
        })
        .catch((err) => {
          reject(err);
        });

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
          on:click={() => (showVersionDetails = true)}>Details</button
        >
      </div>
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
    title="API Version {versions[selectedVersionIndex]}"
    onClose={() => (showVersionDetails = false)}
  >
    <div>
      <ul>
        {#each versionDetails as vd, key (key)}
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