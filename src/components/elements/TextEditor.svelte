<script lang="ts">
  import type { EditorView } from "codemirror";
  import { onDestroy, onMount } from "svelte";
  import { newEditor, updateTheme } from "src/lib/editor";
  import Settings, { SettingsSubscriptionManager } from "src/lib/settings";

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

  /*
  const {StringTableResource} = window.S4TK.models;

  const stbl = new StringTableResource();

  stbl.addAndHash("first");
  stbl.addAndHash("second");
  stbl.addAndHash("third");

  output(JSON.stringify(stbl.toJsonObject(), null, 2));
  */
</script>

<div
  bind:this={editorElement}
  class="absolute top-0 bottom-0 left-0 right-0 overflow-auto"
/>
