import { EditorView, keymap } from "@codemirror/view";
import { Compartment, EditorState } from "@codemirror/state";
// import { EditorState, basicSetup } from "@codemirror/basic-setup";
// import { xml } from "@codemirror/lang-xml";
import { indentWithTab } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
// import darkDefault from './themes/darkDefault';
// import lightDefault from './themes/lightDefault';
// import type { Theme } from '../../types/themes';
import { oneDark } from "src/lib/editor-theme-dark";

/*
NOTE: I know this is one of the most important and prominent rendering processes of the app, so it
may seem a little strange that it is completely managed by the main process rather than by the 
front end. The reasoning for this is because Codemirror is a node package, and the renderer/front
end does not have access to node modules for security reasons.
*/

const themeCompartment = new Compartment();

/**
 * Creates a new editor mounted on the element with the given ID.
 * 
 * @param parent The element to mount the editor on
 * @param isDarkTheme Whether or not the theme is dark
 */
export function newEditor(parent: HTMLElement, isDarkTheme: boolean): EditorView {
  return new EditorView({
    parent: parent,
    state: EditorState.create({
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        javascript(),
        themeCompartment.of(isDarkTheme ? oneDark : oneDark)
      ]
    })
  });
}

/**
 * Updates the contents of the given editor to the given string.
 * 
 * @param editor The editor to change the contents of
 * @param contents What to change the contents of the editor to
 */
export function updateContents(editor: EditorView, contents: string) {
  editor.update([editor.state.update({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: contents
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
  const theme = isDarkTheme ? oneDark : oneDark;
  editor.dispatch({
    effects: themeCompartment.reconfigure(theme)
  });
}
