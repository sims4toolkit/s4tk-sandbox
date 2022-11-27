<script lang="ts">
  import type { EditorView } from "codemirror";
  import { onMount } from "svelte";
  import { newEditor } from "src/lib/editor";

  export let editor: EditorView = null;
  let editorElement: HTMLDivElement;

  onMount(() => {
    editor = newEditor(editorElement, true);
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
