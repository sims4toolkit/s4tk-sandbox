<script lang="ts">
  import { link } from "svelte-spa-router";
  import type { TutorialMetaData } from "src/lib/tutorials";
  import TutorialTag from "./TutorialTag.svelte";

  export let data: TutorialMetaData;
</script>

<a href="/tutorials/{data.key}" use:link class="no-underline">
  <div
    class="flex flex-col gap-2 h-full p-4 bg-gray-200 dark:bg-gray-700 rounded-md drop-shadow"
  >
    <h4 class="text-primary text-lg font-bold">{data.name}</h4>
    <p class="flex-1">{data.description}</p>
    <div class="flex gap-1 whitespace-normal">
      {#each data.tags as tag, key (key)}
        <TutorialTag {tag} />
      {/each}
    </div>
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
