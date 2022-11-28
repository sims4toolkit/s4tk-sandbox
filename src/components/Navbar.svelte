<script lang="ts">
  import Settings from "src/lib/settings";

  // redundant so icon can react without accessing settings
  let isLightTheme = Settings.isLightTheme;
  $: themeIcon = isLightTheme ? "sunny" : "moon";

  function toggleTheme() {
    Settings.isLightTheme = !Settings.isLightTheme;
    isLightTheme = Settings.isLightTheme;
  }
</script>

<nav
  class="fixed top-0 left-0 right-0 h-10 z-0 px-4 flex justify-between gap-4 bg-gray-200 dark:bg-gray-950 bottom-shadow"
>
  <a
    class="flex gap-2 items-center no-underline tint-on-hover whitespace-nowrap"
    href="/#"
  >
    <img src="./assets/s4tk-transparent.png" alt="S4TK" class="h-5" />
    <h2 class="font-bold">S4TK Sandbox</h2>
  </a>
  <div class="flex gap-3 items-center">
    <a href="http://sims4toolkit.com/#/docs" target="_blank">
      <img
        src="./assets/book-outline.svg"
        alt="Docs"
        class="svg tint-on-hover h-5"
      />
    </a>
    <button on:click={toggleTheme}>
      <img
        src="./assets/{themeIcon}-outline.svg"
        alt="Theme"
        class="svg tint-on-hover h-5"
      />
    </button>
  </div>
</nav>

<style lang="scss">
  nav {
    overflow: visible !important;
  }
</style>
