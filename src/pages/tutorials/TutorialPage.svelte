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

  let fetchedTutorial: Tutorial;
  let tutorialMetaData: TutorialMetaData;
  let currentPageIndex = 0;

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
        currentPageIndex = 0;
        updateEditorContent(editor, tutorial.pages[0].script);
      })
      .catch((err) => {
        console.error(err);
        replace(`#/tutorial-not-found/${params.name}`);
      });
  });
</script>

<svelte:head>
  <title>Tutorial | {tutorialName}</title>
</svelte:head>

<div class="fixed top-10 left-0 right-0 bottom-0 dark:bg-gray-900">
  <VerticalSplitView leftPanelName="Tutorial Manager" defaultLeftWidth={400}>
    <div
      slot="left"
      class="absolute left-0 right-0 top-0 bottom-0 overflow-y-auto"
    >
      <ApiVersionSwitcher fixedVersion="0.1.0" />
      <div class="p-2">
        <hr class="mb-4" />
        {#if Boolean(fetchedTutorial)}
          <div class="overflow-hidden whitespace-normal break-words">
            <p class="text-subtle font-bold text-xs mb-1">TUTORIAL</p>
            <h4 class="text-primary text-lg mb-2">
              {tutorialName}
            </h4>
            <p class="text-sm">
              {tutorialDescription}
            </p>
          </div>
          <hr class="my-4" />
          {#if Boolean(currentPage)}
            <div class="whitespace-pre-wrap">
              {@html currentPage.guide}
            </div>
          {/if}
        {:else}
          <p class="text-subtle">Loading...</p>
        {/if}
      </div>
      <!-- TODO: pagination -->
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
