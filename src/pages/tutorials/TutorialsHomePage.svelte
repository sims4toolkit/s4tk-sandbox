<script lang="ts">
  import { link } from "svelte-spa-router";
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import Footer from "src/components/Footer.svelte";
  import { fetchTutorialsIndex } from "src/lib/tutorials";

  fetchTutorialsIndex().then((index) => {
    console.log(index);
  });
</script>

<svelte:head>
  <title>S4TK Tutorials</title>
</svelte:head>

<section class="pt-10 flex-1 w-full flex justify-center">
  <div class="w-full xl:max-w-screen-xl px-4 flex flex-col justify-center">
    <div class="mb-4">
      <SectionHeader title="Tutorials" />
    </div>
    <a href="/tutorials/test" use:link>Test tutorial</a>
  </div>
</section>
<Footer />
