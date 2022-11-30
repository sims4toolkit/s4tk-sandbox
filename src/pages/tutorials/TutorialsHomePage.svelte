<script lang="ts">
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import Footer from "src/components/Footer.svelte";
  import { fetchTutorialsIndex, TutorialData } from "src/lib/tutorials";
  import TutorialLink from "./TutorialLink.svelte";

  let tutorialDatas: (TutorialData & { key: string })[];
  let tutorialsLoaded = false;

  fetchTutorialsIndex().then((index) => {
    tutorialDatas = [];
    for (const key in index.tutorials) {
      const data = index.tutorials[key];
      tutorialDatas.push({ ...data, key });
    }

    // TODO: sort

    tutorialsLoaded = true;
  });
</script>

<svelte:head>
  <title>S4TK Tutorials</title>
</svelte:head>

<section class="pt-20 pb-10 flex-1 w-full flex justify-center">
  <div class="w-full xl:max-w-screen-xl px-4">
    <SectionHeader title="Tutorials" />
    <div class="w-full tutorials-wrapper mt-10">
      {#if tutorialsLoaded}
        {#each tutorialDatas as data, key (key)}
          <TutorialLink {data} />
        {/each}
      {/if}
    </div>
  </div>
</section>
<Footer />

<style lang="scss">
  .tutorials-wrapper {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>
