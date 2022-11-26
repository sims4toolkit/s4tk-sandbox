<script lang="ts">
  import Navbar from "./components/Navbar.svelte";
  import ModeSwitcher from "./components/ModeSwitcher.svelte";
  import Tailwindcss from "./Tailwindcss.svelte";
</script>

<Tailwindcss />
<ModeSwitcher />
<Navbar />
<main class="p-4 mx-auto text-center max-w-xl">
  <p>Test</p>
</main>

<style lang="scss">
  // intentionally blank
</style>
