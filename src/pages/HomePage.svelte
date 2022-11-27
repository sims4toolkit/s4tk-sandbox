<script lang="ts">
  // intentionally blank

  let sourceCode: string = "";
  let output: string = "";
  const placeholderText = "const { Package } = window.S4TK.models;";

  //@ts-ignore
  window.Sandbox = {
    output: (content: string) => (output += content + "\n"),
  };

  async function runCode() {
    try {
      output = "";
      const code = `const output = window.Sandbox.output;${sourceCode}`;
      eval(code);
    } catch (err) {
      output = err;
    }
  }

  async function fetchS4TK(version: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      // FIXME: cache with indexed DB, not local storage

      const storageKey = `s4tk-api-${version}`;
      const cached = localStorage.getItem(storageKey);

      if (cached) return resolve(cached);

      fetch(
        `https://raw.githubusercontent.com/sims4toolkit/browserfied/version/${version}/build/s4tk.min.js`
      )
        .then((res) => {
          res.text().then((text) => {
            localStorage.setItem(storageKey, text);
            resolve(text);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  (async () => {
    const s4tkApi = await fetchS4TK("0.1.0");
    eval(s4tkApi);
  })();
</script>

<div class="mt-10 p-4">
  <textarea
    bind:value={sourceCode}
    class="w-full p-4 monospace bg-gray-200 dark:bg-gray-900"
    placeholder={placeholderText}
  />
  <div>
    <p>{output}</p>
  </div>
</div>

<button
  on:click={runCode}
  title="Run"
  class="fixed right-4 bottom-4 h-10 w-10 flex items-center justify-center rounded-full bg-secondary drop-shadow z-40"
>
  <img src="./assets/play.svg" class="svg-invert h-6" alt=">" />
</button>

<style lang="scss">
  textarea {
    color: var(--color-text);

    &::placeholder {
      color: var(--color-text-subtle);
    }
  }
</style>
