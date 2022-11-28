<script lang="ts">
  export let title: string;
  export let onClose: () => void;
</script>

<div
  class="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
>
  <div class="bg-gray-300 dark:bg-gray-800 p-4 rounded drop-shadow-md">
    <div class="w-full flex justify-between gap-8 mb-4">
      <h4 class="text-sm text-subtle uppercase font-bold">{title}</h4>
      <button on:click={onClose}>
        <img src="./assets/x.svg" class="svg h-4 tint-on-hover" alt="X" />
      </button>
    </div>
    <slot />
  </div>
</div>
