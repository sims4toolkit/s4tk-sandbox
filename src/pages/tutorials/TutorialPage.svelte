<script lang="ts">
  import type { EditorView } from "codemirror";
  import { onMount } from "svelte";
  import SandboxEditor from "src/components/editor/SandboxEditor.svelte";
  import type { FloatingActionButtonData } from "src/components/elements/types";
  import { updateEditorContent } from "src/lib/editor";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";
  import ApiVersionSwitcher from "src/components/editor/ApiVersionSwitcher.svelte";

  export let params: { name: string };

  let sandboxEditor: SandboxEditor;
  let buttonData: FloatingActionButtonData[] = [];
  let currentScriptContent: string;
  let currentScriptName = params.name; // FIXME: what if none?
  let editor: EditorView;
  let fetchedScript: string;

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
          if (fetchedScript) {
            updateEditorContent(editor, fetchedScript);
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

    fetchScript()
      .then((script) => {
        fetchedScript = script;
        updateEditorContent(editor, script);
      })
      .catch((err) => {
        console.error(err); // TODO:
      });
  });

  async function fetchScript(): Promise<string> {
    return params.name;
  }
</script>

<svelte:head>
  <title>Tutorial</title>
</svelte:head>

<div class="fixed top-10 left-0 right-0 bottom-0 dark:bg-gray-900">
  <VerticalSplitView leftPanelName="File Manager">
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
    />
  </VerticalSplitView>
</div>
