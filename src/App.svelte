<script lang="ts">
  import Router from "svelte-spa-router";
  import Navbar from "src/components/Navbar.svelte";
  import HomePage from "src/pages/HomePage.svelte";
  import NotFoundPage from "src/pages/NotFoundPage.svelte";
  import SandboxPage from "src/pages/SandboxPage.svelte";
  import HelpPage from "src/pages/HelpPage.svelte";

  const routes = {
    "/": HomePage,
    "/code": SandboxPage,
    "/help": HelpPage,
    "*": NotFoundPage,
  };
</script>

<Navbar />
<main class="min-h-screen flex flex-col">
  <Router {routes} restoreScrollState={true} />
</main>
