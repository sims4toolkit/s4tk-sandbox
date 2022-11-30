<script lang="ts">
  import { replace } from "svelte-spa-router";
  import type { EditorView } from "codemirror";
  import { onMount } from "svelte";
  import SandboxEditor from "src/components/editor/SandboxEditor.svelte";
  import type { FloatingActionButtonData } from "src/components/elements/types";
  import { updateEditorContent } from "src/lib/editor";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";
  import ApiVersionSwitcher from "src/components/editor/ApiVersionSwitcher.svelte";
  import { fetchTutorial, Tutorial } from "src/lib/tutorials";

  export let params: { name: string };

  let sandboxEditor: SandboxEditor;
  let buttonData: FloatingActionButtonData[] = [];
  let currentScriptContent: string;
  let currentScriptName = params.name; // FIXME: what if none?
  let editor: EditorView;
  let fetchedTutorial: Tutorial;

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
          if (fetchedTutorial) {
            updateEditorContent(editor, fetchedTutorial.script);
          } else {
            // TODO: error handling
            console.error("Script was never fetched");
          }
        },
      },
      {
        color: "Green",
        title: "Run",
        icon: "play",
        onClick: sandboxEditor.runEditorScript,
      },
    ];

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
  <title>Tutorial | {params.name}</title>
</svelte:head>

<div class="fixed top-10 left-0 right-0 bottom-0 dark:bg-gray-900">
  <VerticalSplitView leftPanelName="Tutorial Manager">
    <div slot="left" class="absolute left-0 right-0 top-0 bottom-0">
      <ApiVersionSwitcher fixedVersion="0.1.0" />
      <p>Test</p>
    </div>
    <SandboxEditor
      slot="right"
      bind:this={sandboxEditor}
      bind:buttonData
      bind:currentScriptContent
      bind:currentScriptName
      bind:editor
      useFileSystem={false}
      isTutorial={true}
    />
  </VerticalSplitView>
</div>