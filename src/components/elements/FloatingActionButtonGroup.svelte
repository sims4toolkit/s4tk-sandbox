<script lang="ts">
  import type { FloatingActionButtonData } from "./types";
  import FloatingActionButton from "./FloatingActionButton.svelte";
  import FloatingActionButtonTitle from "./FloatingActionButtonTitle.svelte";

  export let disabled = false;
  export let buttonData: FloatingActionButtonData[];

  let titleText: string;
  let titleColor: string;
  $: showTitle = Boolean(titleText);

  function toggleTitle(text?: string, color?: string) {
    titleText = text;
    titleColor = color;
  }
</script>

<div class="fixed right-6 bottom-6 z-0">
  {#if showTitle}
    <FloatingActionButtonTitle text={titleText} color={titleColor} {disabled} />
  {/if}
  <div class="flex">
    {#each buttonData as data, key (key)}
      <FloatingActionButton bind:data {toggleTitle} />
    {/each}
  </div>
</div>

<style lang="scss" global>
  :root {
    --toolbar-green: #68a768;
    --toolbar-cyan: #5391c7;
    --toolbar-azure: #4970c7;
    --toolbar-red: #c16262;
    --toolbar-pink: #c46db4;
    --toolbar-purple: #845bb5;
    --toolbar-orange: #d3975c;

    &.dark {
      --toolbar-hover-fg: white;
      --toolbar-hover-filter: var(--filter-light);
      --toolbar-disabled-fg: white;
      --toolbar-disabled-bg: #474c56;
    }

    &:not(.dark) {
      --toolbar-hover-fg: white;
      --toolbar-hover-filter: var(--filter-light);
      --toolbar-disabled-fg: black;
      --toolbar-disabled-bg: #c9c9c9;
    }
  }
</style>
