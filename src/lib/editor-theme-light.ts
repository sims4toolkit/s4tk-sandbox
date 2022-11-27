import { EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

const invalid = "#0000000",
  ivory = "#abb2bf",
  stone = "#778191",
  darkGray = "#323232",
  green = "#34a312",
  purple = "#a807ed",
  blue = "#006eff",
  red = "#e63c5b",
  highlightBackground = "#ebebeb",
  background = "#ebedf0",
  selection = "#c7dded",
  selectionTransparent = "#c7ddedf9",
  cursor = "#528bff",
  teal = "#226b53",
  orange = "#e87307";

/// The colors used in the theme, as CSS color strings.
export const color = {
  invalid,
  ivory,
  stone,
  darkGray,
  green,
  purple,
  blue,
  red,
  highlightBackground,
  background,
  selectionTransparent,
  selection,
  cursor
};

/// The editor theme styles for One Dark.
export const lightTheme = EditorView.theme({
  "&": {
    color: ivory,
    // backgroundColor: background
  },

  ".cm-content": {
    caretColor: cursor
  },

  ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: selection },

  ".cm-panels": { color: ivory },
  ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
  ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },

  ".cm-activeLine": { backgroundColor: "#6699ff0b" },
  ".cm-selectionMatch": { backgroundColor: "#aafe661a" },

  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847",
    outline: "1px solid #515a6b"
  },

  ".cm-gutters": {
    backgroundColor: background,
    color: stone,
    border: "none"
  },

  ".cm-activeLineGutter": {
    backgroundColor: highlightBackground
  },

  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },

  ".cm-tooltip": {
    border: "none",
    backgroundColor: ivory
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: ivory,
    borderBottomColor: ivory
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: highlightBackground,
      color: ivory
    }
  }
}, { dark: false });

/// The highlighting style for code in the One Dark theme.
export const lightHighlightStyle = HighlightStyle.define([
  {
    tag: t.keyword,
    color: purple
  },
  {
    tag: [t.deleted, t.macroName, t.propertyName, t.definition(t.name)],
    color: red
  },
  {
    tag: [t.function(t.variableName), t.labelName],
    color: blue
  },
  {
    tag: [t.color, t.constant(t.name), t.standard(t.name)],
    color: orange
  },
  {
    tag: [t.separator, t.character, t.name],
    color: darkGray
  },
  {
    tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
    color: orange
  },
  {
    tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
    color: teal
  },
  {
    tag: [t.meta, t.comment],
    color: stone
  },
  {
    tag: t.strong,
    fontWeight: "bold"
  },
  {
    tag: t.emphasis,
    fontStyle: "italic"
  },
  {
    tag: t.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: t.link,
    color: stone,
    textDecoration: "underline"
  },
  {
    tag: t.heading,
    fontWeight: "bold",
    color: red
  },
  {
    tag: [t.atom, t.bool, t.special(t.variableName)],
    color: orange
  },
  {
    tag: [t.processingInstruction, t.string, t.inserted],
    color: green
  },
  {
    tag: t.invalid,
    color: invalid
  },
]);

/// Extension to enable the One Dark theme (both the editor theme and
/// the highlight style).
export const lightEditor: Extension = [lightTheme, syntaxHighlighting(lightHighlightStyle)]