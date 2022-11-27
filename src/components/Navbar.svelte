<script lang="ts">
  import { link, location } from "svelte-spa-router";

  $: homeIcon = $location === "/" ? "home" : "home-outline";
  $: helpIcon = $location === "/help" ? "help-circle" : "help-circle-outline";
</script>

<nav
  class="fixed top-0 left-0 right-0 h-10 px-4 z-30 flex justify-between gap-4 bg-gray-200 dark:bg-black bottom-shadow"
>
  <a
    class="flex gap-2 items-center no-underline tint-on-hover whitespace-nowrap"
    href="/#"
  >
    <img src="./assets/s4tk-transparent.png" alt="S4TK" class="h-5" />
    <h2 class="font-bold">S4TK Sandbox</h2>
  </a>
  <div class="flex gap-3 items-center">
    <a href="/" use:link>
      <img
        src="./assets/{homeIcon}.svg"
        alt="Home"
        class="svg tint-on-hover h-5"
      />
    </a>
    <a href="/help" use:link>
      <img
        src="./assets/{helpIcon}.svg"
        alt="Help"
        class="svg tint-on-hover h-6"
      />
    </a>
  </div>
</nav>

<style lang="scss">
  nav {
    overflow: visible !important;
  }
</style>
