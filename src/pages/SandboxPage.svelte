<script lang="ts">
  import type { EditorView } from "codemirror";
  import { saveAs } from "file-saver";
  import TextEditor from "src/components/elements/TextEditor.svelte";
  import HorizontalSplitView from "src/components/layout/HorizontalSplitView.svelte";
  import Modal from "src/components/layout/Modal.svelte";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";
  import { ConsoleProxy } from "src/lib/console-proxy";
  import { hyphenToCamel } from "src/lib/helpers";
  import { onDestroy } from "svelte";

  // let sourceCode: string = "";
  let acceptingOutput = false;
  let output: string = "";
  // const placeholderText = "const { Package } = window.S4TK.models;";

  let editor: EditorView;

  let selectedVersionIndex = 0;

  const versions = ["0.1.0"];

  let showVersionDetails = false;
  let versionDetails: { name: string; version: string }[];

  const subscriptions = [
    ConsoleProxy.subscribe((...args: any[]) => {
      if (acceptingOutput) output += args.join("\n") + "\n";
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  //@ts-ignore
  window.Sandbox = {
    output: (content: string) => (output += content + "\n"),
    importMedia: (filename: string) => {
      console.log(`Importing media '${filename}'`); // TODO:
    },
    download: (filename: string, content: string | Buffer) => {
      console.log(`Downloading '${filename}'...`); // TODO:
      saveAs(new Blob([content]), filename);
    },
    require(path: string) {
      try {
        if (path === "fs" || path === "path")
          throw new Error(
            "The Node file system is unavailable in this environment. Use the Sandbox's upload/download feature to interact with files."
          );

        const moduleNames = path.replace("@s4tk/", "").split("/");

        let moduleValue: any;
        for (let i = 0; i < moduleNames.length; ++i) {
          const moduleName = hyphenToCamel(moduleNames[i]);

          if (moduleValue) {
            moduleValue = moduleValue[moduleName];
          } else {
            //@ts-ignore
            moduleValue = window.S4TK[moduleName];
          }

          if (moduleValue == undefined)
            throw new Error(
              `Could not resolve '${path}' as an S4TK module. Note that Node modules are not available in this environment.`
            );
        }

        return moduleValue;
      } catch (err) {
        console.error(err);
      }
    },
  };

  async function runCode() {
    acceptingOutput = true;
    try {
      output = "";
      const sourceCode = editor.state.doc.toJSON().join("\n");
      const code = `const Buffer = window.Node.Buffer;const Sandbox = window.Sandbox;const require = Sandbox.require;${sourceCode}`;
      eval(code);
    } catch (err) {
      output += err;
    }
    acceptingOutput = false;
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
      <HorizontalSplitView bottomPanelName="Output">
        <div slot="top">
          <!-- <textarea
            bind:value={sourceCode}
            class="w-full min-h-full p-2 monospace bg-transparent"
            placeholder={placeholderText}
          /> -->
          <TextEditor bind:editor />
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
              Console logs will be output here.
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
  class="fixed right-4 bottom-4 h-10 w-10 flex items-center justify-center rounded-full bg-secondary drop-shadow-md z-10"
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
    </div>
  </Modal>
{/if}

<!-- <style lang="scss">
  textarea {
    color: var(--color-text);

    &::placeholder {
      color: var(--color-text-subtle);
    }
  }
</style> -->
