<script lang="ts">
  export let tag: string;
</script>

{#if tag === "Sandbox"}
  <p class="text-xs px-1 bg-sky-300 text-sky-900 rounded max-w-min">
    {tag}
  </p>
{:else if tag === "Utilities"}
  <p class="text-xs px-1 bg-emerald-300 text-emerald-900 rounded max-w-min">
    {tag}
  </p>
{:else if tag === "Advanced"}
  <p class="text-xs px-1 bg-pink-300 text-pink-900 rounded max-w-min">
    {tag}
  </p>
{:else if tag === "Models"}
  <p class="text-xs px-1 bg-purple-300 text-purple-900 rounded max-w-min">
    {tag}
  </p>
{:else}
  <p class="text-xs px-1 bg-orange-300 text-orange-900 rounded max-w-min">
    {tag}
  </p>
{/if}
