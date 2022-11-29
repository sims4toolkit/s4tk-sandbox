<script lang="ts">
  import { onMount } from "svelte";

  export let params: { name: string };

  onMount(() => {
    fetchScript()
      .then((script) => {
        // TODO:
      })
      .catch((err) => {
        // TODO:
      });
  });

  async function fetchScript(): Promise<string> {
    return params.name;
  }
</script>

<svelte:head>
  <title>Loading...</title>
</svelte:head>

<p class="mt-20">Loading tutorial...</p>
