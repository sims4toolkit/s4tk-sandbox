<script lang="ts">
  import { link } from "svelte-spa-router";
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import Footer from "src/components/Footer.svelte";

  export let params: { name: string };
</script>

<svelte:head>
  <title>Tutorial Not Found</title>
</svelte:head>

<section class="pt-10 flex-1 w-full flex justify-center">
  <div class="w-full xl:max-w-screen-xl px-4 flex flex-col justify-center">
    <div class="mb-4">
      <SectionHeader title="Unlock this tutorial for $4.04" />
    </div>
    <p class="mb-1">
      Just kidding. The tutorial "{params.name}" couldn't be found. Try checking
      <a href="/tutorials" class="text-secondary" use:link
        >the tutorial home page</a
      >.
    </p>
    <p class="mb-8">
      If a link on that page is what led you here, please <a
        class="text-secondary"
        href="https://frankkmods.com/#/about"
        target="_blank">let me know</a
      >.
    </p>
    <p class="text-subtle text-xs">Error 404</p>
  </div>
</section>
<Footer />
