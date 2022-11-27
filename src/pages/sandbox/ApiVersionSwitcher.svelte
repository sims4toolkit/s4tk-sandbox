<script lang="ts">
  import Modal from "src/components/layout/Modal.svelte";
  import { loadApi, S4TK_API_STATE, S4TK_API_VERSIONS } from "src/lib/s4tk-api";

  let apiLoaded = false;
  let showVersionDetails = false;
  let selectedVersionIndex = 0; // FIXME: find index of last API version

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

<div>
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
