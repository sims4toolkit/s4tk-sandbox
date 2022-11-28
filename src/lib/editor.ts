import { EditorView, keymap } from "@codemirror/view";
import { Compartment, EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { darkEditor } from "src/lib/editor-theme-dark";
import { lightEditor } from "src/lib/editor-theme-light";

const themeCompartment = new Compartment();

/**
 * Creates a new editor mounted on the element with the given ID.
 * 
 * @param parent The element to mount the editor on
 * @param onChange Function to call when content changed
 * @param isDarkTheme Whether or not the theme is dark
 */
export function newEditor(parent: HTMLElement, onChange: () => void, isDarkTheme: boolean): EditorView {
  return new EditorView({
    parent: parent,
    state: EditorState.create({
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        javascript(),
        themeCompartment.of(isDarkTheme ? darkEditor : lightEditor),
        EditorView.updateListener.of(update => {
          if (update.transactions.some(t => t.docChanged)) {
            onChange();
          }
        })
      ]
    })
  });
}

/**
 * Updates the contents of the given editor to the given string.
 * 
 * @param editor The editor to change the contents of
 * @param content What to change the contents of the editor to
 */
export function updateEditorContent(editor: EditorView, content: string) {
  editor.update([editor.state.update({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: content
    }
  })]);
}

/**
 * Toggles the theme of the editor between light and dark.
 * 
 * @param editor The editor to update the theme of
 * @param isDarkTheme Whether or not the theme is dark
 */
export function updateTheme(editor: EditorView, isDarkTheme: boolean) {
  const theme = isDarkTheme ? darkEditor : lightEditor;
  editor.dispatch({
    effects: themeCompartment.reconfigure(theme)
  });
}
