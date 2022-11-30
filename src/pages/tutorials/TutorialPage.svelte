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
  } from "src/lib/tutorials";

  export let params: { name: string };

  let sandboxEditor: SandboxEditor;
  let buttonData: FloatingActionButtonData[] = [];
  let currentScriptContent: string;
  let editor: EditorView;

  let fetchedTutorial: Tutorial;
  let tutorialName = params.name;
  let tutorialDescription = "";

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
          updateEditorContent(editor, fetchedTutorial.script);
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
        const tutorialData = index.tutorials[params.name];
        if (tutorialData) {
          tutorialName = tutorialData.name;
          tutorialDescription = tutorialData.description;
          // TODO: also make sure required API version is used
        }
      })
      .catch((err) => {
        console.error(err);
      });

    fetchTutorial(params.name)
      .then((tutorial) => {
        fetchedTutorial = tutorial;
        updateEditorContent(editor, tutorial.script);
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
  <VerticalSplitView leftPanelName="Tutorial Manager">
    <div slot="left" class="absolute left-0 right-0 top-0 bottom-0">
      <ApiVersionSwitcher fixedVersion="0.1.0" />
      {#if Boolean(fetchedTutorial)}
        <div class="p-2">
          <div class="overflow-hidden whitespace-normal break-words">
            <h4 class="text-primary font-bold mb-1">
              {tutorialName}
            </h4>
            <p class="text-subtle text-sm mb-4">
              {tutorialDescription}
            </p>
          </div>

          <div class="whitespace-pre-wrap">
            <!-- FIXME: this is markdown -->
            {fetchedTutorial.guide}
          </div>
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
