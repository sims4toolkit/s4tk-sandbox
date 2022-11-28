<script lang="ts">
  import type { EditorView } from "codemirror";
  import type { FloatingActionButtonData } from "src/components/elements/types";
  import { updateEditorContent } from "src/lib/editor";
  import { runScript } from "src/lib/script-runner";
  import TextEditor from "src/components/elements/TextEditor.svelte";
  import HorizontalSplitView from "src/components/layout/HorizontalSplitView.svelte";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";
  import ConsolePanel from "src/pages/sandbox/ConsolePanel.svelte";
  import ApiVersionSwitcher from "src/pages/sandbox/ApiVersionSwitcher.svelte";
  import FileSystem from "src/pages/sandbox/FileSystem.svelte";
  import FloatingActionButtonGroup from "src/components/elements/FloatingActionButtonGroup.svelte";
  import FileManager from "src/lib/file-manager";
  import { saveAs } from "file-saver";

  let running = false;
  let output: string = "";
  let editor: EditorView;
  let currentConsoleTab: any;

  let currentScriptName: string;
  let currentScriptContent: string;

  const buttonData: FloatingActionButtonData[] = [
    {
      color: "Purple",
      title: "Download",
      icon: "download",
      onClick: downloadEditorScript,
    },
    {
      color: "Azure",
      title: "Save",
      icon: "save-outline",
      onClick: saveEditorScript,
    },
    {
      color: "Green",
      title: "Run",
      icon: "play",
      disabled: running,
      onClick: runEditorScript,
    },
  ];

  function saveEditorScript() {
    const fm = FileManager.getInstance("script");
    currentScriptContent = editor.state.doc.toJSON().join("\n");
    fm.setFileContent(currentScriptName, currentScriptContent);
  }

  async function downloadEditorScript() {
    saveEditorScript();

    const filename = currentScriptName.endsWith(".js")
      ? currentScriptName
      : `${currentScriptName}.js`;

    saveAs(currentScriptContent, filename);
  }

  async function runEditorScript() {
    saveEditorScript();
    running = true;
    output = "Running...";
    const outputLines: string[] = [];
    runScript(currentScriptContent, outputLines);
    output = outputLines.join("\n");
    running = false;
  }

  function handleScriptLoaded(filename: string, content: string) {
    const fm = FileManager.getInstance("script");
    if (fm.hasFile(currentScriptName)) saveEditorScript();
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
      <FileSystem onScriptLoaded={handleScriptLoaded} />
    </div>
    <div
      slot="right"
      class="absolute left-0 right-0 top-0 bottom-0 dark:bg-gray-800"
    >
      <HorizontalSplitView bottomPanelName={currentConsoleTab}>
        <div slot="top">
          <TextEditor bind:filename={currentScriptName} bind:editor />
        </div>
        <ConsolePanel
          slot="bottom"
          bind:output
          bind:currentTab={currentConsoleTab}
        />
      </HorizontalSplitView>
    </div>
  </VerticalSplitView>
</div>

<FloatingActionButtonGroup {buttonData} />
