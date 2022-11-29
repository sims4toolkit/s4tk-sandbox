<script lang="ts">
  import Router from "svelte-spa-router";
  import Navbar from "src/components/Navbar.svelte";
  import SandboxPage from "src/pages/sandbox/SandboxPage.svelte";
  import NotFoundPage from "src/pages/NotFoundPage.svelte";
  import TutorialsHomePage from "./pages/tutorials/TutorialsHomePage.svelte";
  import TutorialPage from "./pages/tutorials/TutorialPage.svelte";

  const routes = {
    "/": SandboxPage,
    "/tutorials": TutorialsHomePage,
    "/tutorials/:name": TutorialPage,
    "*": NotFoundPage,
  };
</script>

<Navbar />
<main class="min-h-screen flex flex-col">
  <Router {routes} restoreScrollState={true} />
</main>
