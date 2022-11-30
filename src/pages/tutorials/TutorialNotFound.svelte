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
    <p class="mb-8">
      Just kidding. The tutorial "{params.name}" doesn't exist. Please
      <a href="/tutorials" class="text-secondary" use:link
        >browse the ones that do</a
      >.
    </p>
    <p class="text-subtle text-xs">Error 404</p>
  </div>
</section>
<Footer />
