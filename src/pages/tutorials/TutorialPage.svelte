<script lang="ts">
  import { replace } from "svelte-spa-router";
  import type { EditorView } from "codemirror";
  import { onMount } from "svelte";
  import SandboxEditor from "src/components/editor/SandboxEditor.svelte";
  import type { FloatingActionButtonData } from "src/components/elements/types";
  import { updateEditorContent } from "src/lib/editor";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";
  import ApiVersionSwitcher from "src/components/editor/ApiVersionSwitcher.svelte";
  import {
    fetchTutorial,
    fetchTutorialsIndex,
    Tutorial,
    TutorialMetaData,
  } from "src/lib/tutorials";

  export let params: { name: string };

  let sandboxEditor: SandboxEditor;
  let buttonData: FloatingActionButtonData[] = [];
  let currentScriptContent: string;
  let editor: EditorView;
  let scrollableGuide: HTMLDivElement;

  let fetchedTutorial: Tutorial;
  let tutorialMetaData: TutorialMetaData;
  let currentPageIndex = 0;

  $: canClickBack = currentPageIndex !== 0;
  $: canClickNext = currentPageIndex + 1 < (fetchedTutorial?.pages.length ?? 0);
  $: tutorialName = tutorialMetaData?.name ?? "Loading...";
  $: tutorialDescription = tutorialMetaData?.description ?? "Loading...";
  $: currentPage = fetchedTutorial?.pages[currentPageIndex];

  onMount(() => {
    buttonData = [
      {
        color: "Purple",
        title: "Download",
        icon: "download",
        onClick: sandboxEditor.downloadEditorScript,
      },
      {
        color: "Orange",
        title: "Reset",
        icon: "refresh",
        onClick() {
          updateEditorContent(editor, currentPage?.script);
          sandboxEditor.clearOutput();
        },
      },
      {
        color: "Green",
        title: "Run",
        icon: "play",
        onClick: sandboxEditor.runEditorScript,
      },
    ];

    fetchTutorialsIndex()
      .then((index) => {
        tutorialMetaData = index.tutorials[params.name];
      })
      .catch((err) => {
        console.error(err);
      });

    fetchTutorial(params.name)
      .then((tutorial) => {
        fetchedTutorial = tutorial;
        window.Sandbox.mediaOverride = fetchedTutorial.media;
        currentPageIndex = 0;
        updateEditorContent(editor, tutorial.pages[0].script);
      })
      .catch((err) => {
        console.error(err);
        replace(`#/tutorial-not-found/${params.name}`);
      });
  });

  function handleBackButtonPressed() {
    if (canClickBack) {
      --currentPageIndex;
      resetEditor();
    }
  }

  function handleNextButtonPressed() {
    if (canClickNext) {
      ++currentPageIndex;
      resetEditor();
    }
  }

  function resetEditor() {
    // don't use currentPage because of timing
    updateEditorContent(editor, fetchedTutorial.pages[currentPageIndex].script);
    sandboxEditor.clearOutput();
    scrollableGuide.scrollTop = 0;
  }
</script>

<svelte:head>
  <title>Tutorial | {tutorialName}</title>
</svelte:head>

<div class="fixed top-10 left-0 right-0 bottom-0 dark:bg-gray-900">
  <VerticalSplitView leftPanelName="Tutorial Guide" defaultLeftWidth={400}>
    <div
      slot="left"
      class="absolute left-0 right-0 top-0 bottom-0 flex flex-col"
    >
      <ApiVersionSwitcher fixedVersion="0.1.0" />
      <hr class="mt-2 mb-4 mx-2" />
      <div
        bind:this={scrollableGuide}
        class="flex-1 px-2 pb-2 flex-grow overflow-y-auto"
      >
        {#if Boolean(fetchedTutorial)}
          <div class="overflow-hidden whitespace-normal break-words">
            <p class="text-subtle font-bold text-xs mb-1">TUTORIAL</p>
            <h4 class="text-primary text-lg mb-2 font-bold">
              {tutorialName}
            </h4>
            <p class="text-sm">
              {tutorialDescription}
            </p>
            {#if Boolean(tutorialMetaData?.docs)}
              <p class="mt-2">
                <a
                  class="text-secondary text-sm"
                  href={tutorialMetaData.docs}
                  target="_blank"
                >
                  Relevant Documentation
                </a>
              </p>
            {/if}
          </div>
          <hr class="my-4" />
          {#if Boolean(currentPage)}
            <div
              class="tutorial-guide-wrapper whitespace-normal flex flex-col gap-2"
            >
              {@html currentPage.guide}
            </div>
          {/if}
        {:else}
          <p class="text-subtle">Loading...</p>
        {/if}
      </div>
      {#if Boolean(fetchedTutorial)}
        <div class="p-2 flex flex-col gap-2 items-center">
          <div class="flex-1 flex justify-between gap-2 w-full">
            <button
              class="flex-1 bg-gray-300 dark:bg-gray-950 border border-solid border-transparent hover:border-gray-400 dark:hover:border-gray-600 rounded flex gap-2 py-1 justify-center items-center select-none"
              class:pointer-events-none={!canClickBack}
              class:opacity-40={!canClickBack}
              disabled={!canClickBack}
              on:click={handleBackButtonPressed}
            >
              <img src="./assets/chevron-left.svg" class="svg h-4" alt="<" />
              <p class="text-sm">Back</p>
            </button>
            <button
              class="flex-1 bg-gray-300 dark:bg-gray-950 border border-solid border-transparent hover:border-gray-400 dark:hover:border-gray-600 rounded flex gap-2 py-1 justify-center items-center  select-none"
              class:pointer-events-none={!canClickNext}
              class:opacity-40={!canClickNext}
              disabled={!canClickNext}
              on:click={handleNextButtonPressed}
            >
              <p class="text-sm">Next</p>
              <img src="./assets/chevron-right.svg" class="svg h-4" alt=">" />
            </button>
          </div>
          <p class="text-xs text-subtle max-w-fit select-none">
            Page {currentPageIndex + 1} of {fetchedTutorial.pages.length}
          </p>
        </div>
      {/if}
    </div>
    <SandboxEditor
      slot="right"
      bind:this={sandboxEditor}
      bind:buttonData
      bind:currentScriptContent
      bind:currentScriptName={tutorialName}
      bind:editor
      useFileSystem={false}
      isTutorial={true}
    />
  </VerticalSplitView>
</div>

<style lang="scss">
  hr {
    border-color: var(--color-shadow);
  }
</style>
