<script lang="ts">
  import type { EditorView } from "codemirror";
  import JSZip from "jszip";
  import { saveAs } from "file-saver";
  import type { FloatingActionButtonData } from "src/components/elements/types";
  import { runScript } from "src/lib/script-runner";
  import TextEditor from "src/components/editor/TextEditor.svelte";
  import HorizontalSplitView from "src/components/layout/HorizontalSplitView.svelte";
  import ConsolePanel from "src/components/editor/ConsolePanel.svelte";
  import FloatingActionButtonGroup from "src/components/elements/FloatingActionButtonGroup.svelte";
  import FileManager from "src/lib/file-manager";

  export let buttonData: FloatingActionButtonData[];
  export let currentScriptContent: string;
  export let currentScriptName: string;
  export let editor: EditorView;
  export let useFileSystem: boolean;
  export let isTutorial = false;

  let currentConsoleTab: any;
  let hasUnsavedChanges = false;
  let output: string;
  let running = false;

  //#region Exported Functions

  export const clearOutput = () => {
    output = "";
  };

  export const downloadEditorScript = async () => {
    saveEditorScript();
    const filename = getDownloadFilename("js");
    saveAs(new Blob([currentScriptContent]), filename);
  };

  export const runEditorScript = async () => {
    if (running) return;

    saveEditorScript();
    running = true;
    output = "Running...";

    // these should already be empty, but just in case
    window.Sandbox.outputStream.length = 0;
    window.Sandbox.downloadQueue.length = 0;

    window.Sandbox.output(`=== Running script '${currentScriptName}' ===\n`);

    const context = isTutorial ? "tutorial" : "filesystem";

    runScript(currentScriptName, currentScriptContent, context)
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
  };

  export const saveEditorScript = async () => {
    currentScriptContent = editor.state.doc.toJSON().join("\n");

    if (useFileSystem) {
      const fm = FileManager.getInstance("script");
      fm.setFileContent(currentScriptName, currentScriptContent);
      hasUnsavedChanges = false;
    }
  };

  //#endregion Exported Functions

  //#region Helper Functions

  function getDownloadFilename(ext: string): string {
    return (
      currentScriptName.endsWith(`.${ext}`)
        ? currentScriptName
        : `${currentScriptName}.${ext}`
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

  //#endregion Helper Functions
</script>

<div class="absolute left-0 right-0 top-0 bottom-0 dark:bg-gray-800">
  <HorizontalSplitView bottomPanelName={currentConsoleTab}>
    <div slot="top">
      <TextEditor
        bind:filename={currentScriptName}
        bind:editor
        bind:hasUnsavedChanges
        bind:useFileSystem
        filePrefix={isTutorial ? "Tutorial" : "File"}
      />
      <FloatingActionButtonGroup {buttonData} />
    </div>
    <ConsolePanel
      slot="bottom"
      bind:output
      bind:currentTab={currentConsoleTab}
      showOutputOnly={!useFileSystem}
    />
  </HorizontalSplitView>
</div>
