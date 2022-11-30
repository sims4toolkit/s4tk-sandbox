<script lang="ts">
  import Router from "svelte-spa-router";
  import Navbar from "src/components/Navbar.svelte";
  import SandboxPage from "src/pages/sandbox/SandboxPage.svelte";
  import NotFoundPage from "src/pages/NotFoundPage.svelte";
  import TutorialsHomePage from "src/pages/tutorials/TutorialsHomePage.svelte";
  import TutorialPage from "src/pages/tutorials/TutorialPage.svelte";
  import TutorialNotFound from "src/pages/tutorials/TutorialNotFound.svelte";

  const routes = {
    "/": SandboxPage,
    "/tutorials": TutorialsHomePage,
    "/tutorials/:name": TutorialPage,
    "/tutorial-not-found/:name": TutorialNotFound,
    "*": NotFoundPage,
  };
</script>

<Navbar />
<main class="min-h-screen flex flex-col">
  <Router {routes} restoreScrollState={true} />
</main>
