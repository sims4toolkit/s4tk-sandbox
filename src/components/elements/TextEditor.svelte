<script lang="ts">
  import type { EditorView } from "codemirror";
  import { onDestroy, onMount } from "svelte";
  import { newEditor, updateTheme } from "src/lib/editor";
  import Settings, { SettingsSubscriptionManager } from "src/lib/settings";

  export let filename: string;
  export let editor: EditorView = null;
  let editorElement: HTMLDivElement;

  const subscriptions = [
    SettingsSubscriptionManager.subscribe("isLightTheme", (isLightTheme) => {
      updateTheme(editor, !isLightTheme);
    }),
  ];

  onMount(() => {
    editor = newEditor(editorElement, !Settings.isLightTheme);
  });

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });
</script>

<div class="absolute top-0 bottom-0 left-0 right-0">
  <div class="absolute top-0 left-0 right-0 h-8 flex items-center pl-2 pt-1">
    <h4 class="text-xs text-subtle">File: {filename ?? "None"}</h4>
  </div>
  <div
    bind:this={editorElement}
    class="absolute top-8 bottom-0 left-0 right-0 overflow-auto"
    hidden={filename == undefined}
  />
</div>
