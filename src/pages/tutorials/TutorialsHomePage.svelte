<script lang="ts">
  import SearchBar from "src/components/elements/SearchBar.svelte";
  import SectionHeader from "src/components/elements/SectionHeader.svelte";
  import Footer from "src/components/Footer.svelte";
  import { fetchTutorialsIndex, TutorialMetaData } from "src/lib/tutorials";
  import TutorialLink from "./TutorialLink.svelte";
  import TutorialTag from "./TutorialTag.svelte";

  let tutorialDatas: TutorialMetaData[];
  let tutorialsLoaded = false;
  let loadError = false;
  let tutorialsToShow: TutorialMetaData[];

  let allTags: string[];
  let requiredTags = new Set<string>();

  let searchQuery = "";

  $: {
    searchQuery;
    if (tutorialsLoaded) refreshTutorialsToShow();
  }

  fetchTutorialsIndex()
    .then((index) => {
      tutorialDatas = [];
      tutorialsToShow = tutorialDatas;
      allTags = index.tags;

      for (const key in index.tutorials) {
        tutorialDatas.push(index.tutorials[key]);
      }

      tutorialDatas.sort((a, b) => {
        if (a.recommended && !b.recommended) return -1;
        else if (b.recommended && !a.recommended) return 1;
        return 0;
      });

      tutorialsLoaded = true;
    })
    .catch((err) => {
      loadError = true;
    });

  function toggleTag(tag: string) {
    if (requiredTags.has(tag)) {
      requiredTags.delete(tag);
    } else {
      requiredTags.add(tag);
    }

    requiredTags = requiredTags;
    refreshTutorialsToShow();
  }

  function refreshTutorialsToShow() {
    tutorialsToShow = tutorialDatas.filter((data) => {
      if (requiredTags.size > 0) {
        if (![...requiredTags].every((tag) => data.tags.includes(tag))) {
          return false;
        }
      }

      if (!searchQuery) return true;
      const lowerSearch = searchQuery.toLowerCase();
      return (
        data.name.toLowerCase().includes(lowerSearch) ||
        data.description.toLowerCase().includes(lowerSearch)
      );
    });
  }
</script>

<svelte:head>
  <title>S4TK Tutorials</title>
</svelte:head>

<section class="pt-20 pb-10 flex-1 w-full min-h-screen flex justify-center">
  <div class="w-full xl:max-w-screen-xl px-4">
    <SectionHeader title="Tutorials" />
    <p class="mt-4">
      These tutorials assume no knowledge of S4TK, but require some familiarity
      with JavaScript. If you're entirely new to JavaScript, please read <a
        href="https://medium.com/p/5307132f02c0"
        target="_blank"
        class="text-secondary">this article</a
      >.
    </p>
    {#if tutorialsLoaded}
      <div
        class="my-10 w-full flex gap-4 flex-col sm:flex-row justify-between items-center"
      >
        <div>
          <p class="text-xs text-subtle mb-2 font-bold">Required Tags</p>
          <div class="flex gap-1">
            {#each allTags as tag, key (key)}
              <button on:click={() => toggleTag(tag)}>
                <TutorialTag {tag} active={requiredTags.has(tag)} />
              </button>
            {/each}
          </div>
        </div>
        <SearchBar bind:searchQuery />
      </div>
      <div class="w-full">
        {#if tutorialsToShow.length > 0}
          <div class="w-full tutorials-wrapper">
            {#each tutorialsToShow as data, key (key)}
              <TutorialLink {data} />
            {/each}
          </div>
        {:else}
          <p class="text-subtle">No tutorials match your search terms.</p>
        {/if}
        <p class="text-subtle mt-8">
          New tutorials are currently being worked on - check back later for
          more!
        </p>
      </div>
    {:else if loadError}
      <p class="text-subtle mt-10">
        An error occurred and the tutorials could not be loaded. Try refreshing
        the page, and if the error persists, please <a
          class="text-secondary"
          href="https://frankkmods.com/#/about"
          target="_blank">let me know</a
        >.
      </p>
    {:else}
      <p class="text-subtle text-lg font-bold mt-10">Loading...</p>
    {/if}
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
