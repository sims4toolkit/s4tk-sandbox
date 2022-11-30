<script lang="ts">
  import { link } from "svelte-spa-router";
  import type { TutorialData } from "src/lib/tutorials";

  export let data: TutorialData & { key: string };
</script>

<a href="/tutorials/{data.key}" use:link class="no-underline">
  <div class="p-4 bg-gray-200 dark:bg-gray-700 rounded-md drop-shadow">
    <h4 class="text-primary text-lg font-bold">{data.name}</h4>
    <p>{data.description}</p>
    <p class="monospace text-subtle text-xs mt-2">
      API: {data.requiredApiVersion}
    </p>
  </div>
</a>

<style lang="scss">
  a {
    min-width: 300px;
    max-width: 100%;
    position: relative;
    transition: top 350ms;
    top: 0;

    &:hover {
      top: -2px;
      cursor: pointer;
    }
  }
</style>
