<script lang="ts">
  import type { EditorView } from "codemirror";
  import JSZip from "jszip";
  import { saveAs } from "file-saver";
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

  let running = false;
  let output: string = "";
  let editor: EditorView;
  let currentConsoleTab: any;

  let currentScriptName: string;
  let currentScriptContent: string;
  let hasUnsavedChanges = false;
  let buttonData: FloatingActionButtonData[];

  $: {
    running;
    refreshButtonData();
  }

  function refreshButtonData() {
    buttonData = [
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
        disabled: running,
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
  }

  function saveEditorScript() {
    const fm = FileManager.getInstance("script");
    currentScriptContent = editor.state.doc.toJSON().join("\n");
    fm.setFileContent(currentScriptName, currentScriptContent);
    hasUnsavedChanges = false;
  }

  async function downloadEditorScript() {
    saveEditorScript();
    const filename = getDownloadFilename("js");
    saveAs(new Blob([currentScriptContent]), filename);
  }

  function getDownloadFilename(extension: string): string {
    return (
      currentScriptName.endsWith(`.${extension}`)
        ? currentScriptName
        : `${currentScriptName}.${extension}`
    ).replace(/[^a-z0-9\.-]/gi, "_");
  }

  async function onScriptFinished() {
    const { outputStream, downloadQueue } = window.Sandbox;

    output = outputStream.join("\n");
    outputStream.length = 0;

    if (downloadQueue.length > 0) {
      if (downloadQueue.length === 1) {
        const { content, filename } = downloadQueue.pop();
        saveAs(new Blob([content]), filename);
      } else {
        const zip = new JSZip();

        const numDownloads = downloadQueue.length;
        for (let i = 0; i < numDownloads; ++i) {
          const { content, filename } = downloadQueue.pop();
          zip.file(filename, new Blob([content]));
        }

        const zipName = getDownloadFilename("downloads.zip");

        const zipBlob = await zip.generateAsync({ type: "blob" });

        saveAs(zipBlob, zipName);
      }
    }

    running = false;
  }

  async function runEditorScript() {
    saveEditorScript();
    running = true;
    output = "Running...";

    // these should already be empty, but just in case
    window.Sandbox.outputStream.length = 0;
    window.Sandbox.downloadQueue.length = 0;

    window.Sandbox.output(`=== Running script '${currentScriptName}' ===\n`);

    runScript(currentScriptName)
      .then(() => {
        window.Sandbox.output(
          `\n=== Script '${currentScriptName}' terminated successfully ===`
        );

        onScriptFinished();
      })
      .catch((err) => {
        window.Sandbox.output(
          err,
          `\n=== Script '${currentScriptName}' terminated with error ===`
        );

        onScriptFinished();
      });
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
          <TextEditor
            bind:filename={currentScriptName}
            bind:editor
            bind:hasUnsavedChanges
          />
          <!-- Don't know why this need to be here, but it fixes Z index -->
          <FloatingActionButtonGroup {buttonData} />
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
