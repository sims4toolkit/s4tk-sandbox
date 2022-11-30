<script lang="ts">
  import type { EditorView } from "codemirror";
  import FileManager from "src/lib/file-manager";
  import type { FloatingActionButtonData } from "src/components/elements/types";
  import { updateEditorContent } from "src/lib/editor";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";
  import ApiVersionSwitcher from "src/components/editor/ApiVersionSwitcher.svelte";
  import FileSystem from "src/pages/sandbox/FileSystem.svelte";
  import SandboxEditor from "src/components/editor/SandboxEditor.svelte";
  import { onMount } from "svelte";

  let sandboxEditor: SandboxEditor;
  let buttonData: FloatingActionButtonData[] = [];
  let currentScriptContent: string;
  let currentScriptName: string;
  let editor: EditorView;

  $: editorInitialized = Boolean(editor);

  onMount(() => {
    buttonData = [
      {
        color: "Purple",
        title: "Download",
        icon: "download",
        onClick: sandboxEditor.downloadEditorScript,
      },
      {
        color: "Azure",
        title: "Save",
        icon: "save-outline",
        onClick: sandboxEditor.saveEditorScript,
      },
      {
        color: "Green",
        title: "Run",
        icon: "play",
        onClick: sandboxEditor.runEditorScript,
      },
    ];
  });

  function handleScriptLoaded(filename: string, content: string) {
    const fm = FileManager.getInstance("script");
    if (fm.hasFile(currentScriptName)) sandboxEditor.saveEditorScript();
    currentScriptName = filename;
    currentScriptContent = content;
    if (content != undefined) updateEditorContent(editor, content);
  }
</script>

<svelte:head>
  <title>Sandbox</title>
</svelte:head>

<div class="fixed top-10 left-0 right-0 bottom-0 dark:bg-gray-900">
  <VerticalSplitView leftPanelName="File Manager">
    <div slot="left" class="absolute left-0 right-0 top-0 bottom-0">
      <ApiVersionSwitcher />
      {#if editorInitialized}
        <FileSystem onScriptLoaded={handleScriptLoaded} />
      {/if}
    </div>
    <SandboxEditor
      slot="right"
      bind:this={sandboxEditor}
      bind:buttonData
      bind:currentScriptContent
      bind:currentScriptName
      bind:editor
      useFileSystem={true}
    />
  </VerticalSplitView>
</div>
