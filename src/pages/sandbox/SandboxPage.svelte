<script lang="ts">
  import type { EditorView } from "codemirror";
  import TextEditor from "src/components/elements/TextEditor.svelte";
  import HorizontalSplitView from "src/components/layout/HorizontalSplitView.svelte";
  import VerticalSplitView from "src/components/layout/VerticalSplitView.svelte";
  import { runScript } from "src/lib/script-runner";
  import ConsolePanel from "src/pages/sandbox/ConsolePanel.svelte";
  import ApiVersionSwitcher from "./ApiVersionSwitcher.svelte";
  import FileList from "./FileList.svelte";

  let running = false;
  let output: string = "";
  let editor: EditorView;

  let currentConsoleTab: any;

  async function runEditorScript() {
    running = true;
    output = "Running...";
    const outputLines: string[] = [];
    runScript(editor.state.doc.toJSON().join("\n"), outputLines);
    output = outputLines.join("\n");
    running = false;
  }

  function handleMediaFileClick(filename: string) {
    alert(filename);
  }

  function handleScriptFileClick(filename: string) {
    alert(filename);
  }
</script>

<svelte:head>
  <title>Sandbox</title>
</svelte:head>

<div class="fixed top-10 left-0 right-0 bottom-0 dark:bg-gray-900">
  <VerticalSplitView leftPanelName="File Manager">
    <div slot="left" class="absolute left-0 right-0 top-0 bottom-0">
      <ApiVersionSwitcher />
      <div class="h-full overflow-y-auto">
        <FileList
          title="Scripts"
          filenames={["first", "second", "third"]}
          onClick={handleScriptFileClick}
          expanded={true}
        />
        <FileList
          title="Media"
          filenames={["first", "second", "third"]}
          onClick={handleMediaFileClick}
        />
      </div>
    </div>
    <div
      slot="right"
      class="absolute left-0 right-0 top-0 bottom-0 dark:bg-gray-800"
    >
      <HorizontalSplitView bottomPanelName={currentConsoleTab}>
        <div slot="top">
          <TextEditor bind:editor />
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

<button
  on:click={runEditorScript}
  title="Run"
  class="fixed right-4 bottom-4 h-10 w-10 flex items-center justify-center rounded-full bg-secondary drop-shadow-md z-10"
  disabled={running}
>
  <img src="./assets/play.svg" class="svg-invert h-6" alt=">" />
</button>
