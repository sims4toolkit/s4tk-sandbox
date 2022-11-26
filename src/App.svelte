<script lang="ts">
  import Router from "svelte-spa-router";
  import Footer from "./components/Footer.svelte";
  import Navbar from "./components/Navbar.svelte";
  import HomePage from "./pages/HomePage.svelte";
  import NotFoundPage from "./pages/NotFoundPage.svelte";

  const routes = {
    "/": HomePage,
    "*": NotFoundPage,
  };
</script>

<Navbar />
<main class="min-h-screen flex flex-col">
  <Router {routes} restoreScrollState={true} />
</main>
<Footer />
