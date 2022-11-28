import App from "src/App.svelte";
import DocumentUtils from "src/lib/document-utils";
import Settings from "src/lib/settings";
import { setupSamples } from "src/lib/samples-setup";

const app = new App({
	target: document.body,
});

window.addEventListener("load", () => {
	DocumentUtils.toggleLightTheme(Settings.isLightTheme, false);

	if (!Settings.hasSeenExampleScript) {
		setupSamples();
		Settings.hasSeenExampleScript = true;
		// FIXME: refresh file managers after sample load
	}
});

export default app;
