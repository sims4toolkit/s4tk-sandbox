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
const { Package, StringTableResource } = require("@s4tk/models");
const { BinaryResourceType } = require("@s4tk/models/enums");
const { fnv64 } = require("@s4tk/hashing");
const { formatResourceKey } = require("@s4tk/hashing/formatting");
const { XmlElementNode } = require("@s4tk/xml-dom");

const pkg = new Package();
const stbl = new StringTableResource();
stbl.addAndHash("Something");

pkg.add(
  {
    type: BinaryResourceType.StringTable,
    group: 0x80000000,
    instance: fnv64("frankk_TEST:stringTable")
  },
  stbl
);

const node = new XmlElementNode({ tag: "T" });

Sandbox.output(formatResourceKey(pkg.entries[0].key));
Sandbox.output(JSON.stringify(stbl.toJsonObject()));
Sandbox.output(node.toXml());
  */
</script>

<div
  bind:this={editorElement}
  class="absolute top-0 bottom-0 left-0 right-0 overflow-auto"
/>
