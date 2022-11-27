<script lang="ts">
  import Router from "svelte-spa-router";
  import Navbar from "src/components/Navbar.svelte";
  import SandboxPage from "src/pages/sandbox/SandboxPage.svelte";
  import NotFoundPage from "src/pages/NotFoundPage.svelte";

  const routes = {
    "/": SandboxPage,
    "*": NotFoundPage,
  };
</script>

<Navbar />
<main class="min-h-screen flex flex-col">
  <Router {routes} restoreScrollState={true} />
</main>
