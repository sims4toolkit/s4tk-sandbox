<div class="flex flex-col gap-4 whitespace-normal">
  <div>
    <h4 class="text-sm font-bold mb-1">Available modules</h4>
    <p class="text-subtle text-sm">
      The sandbox runs client-side, so you do not have access to any Node or npm
      modules. The only modules you can import are those listed in the API
      Version Details / Docs (located at the top of the file manager panel),
      plus a browserified <code>Buffer</code> class (no import necessary - use it
      as if you're in a Node environment).
    </p>
  </div>
  <div>
    <h4 class="text-sm font-bold mb-1">Importing S4TK modules</h4>
    <p class="text-subtle text-sm">
      The available S4TK modules exist on <code>window.S4TK</code>, but require
      syntax is supported for convenience. For example, to import the Package
      class, you can use either
      <code>const {"{ Package }"} = window.S4TK.models</code>
      or
      <code>const {"{ Package }"} = require("@s4tk/models")</code>. The require
      syntax is at full parity with the S4TK Node library.
    </p>
  </div>
  <div>
    <h4 class="text-sm font-bold mb-1">Limitations</h4>
    <p class="text-subtle text-sm">
      '@s4tk/plugin-bufferfromfile' is not available in this environment,
      meaning that any functionality that requires it will not work. Other than
      that, the entirety of S4TK should work identically to its Node
      counterpart. If you notice any discrepancies, please report them.
    </p>
  </div>
  <div>
    <h4 class="text-sm font-bold mb-1">Output</h4>
    <p class="text-subtle text-sm">
      The <code>Sandbox.output(...args: string[])</code> function can be used to
      write generic output to the sandbox console, and
      <code>Sandbox.test(name: string, condition: boolean)</code>
      can be used to run simple pass/fail tests. Note that using the browser's
      <code>console</code> will NOT output to the sandbox console.
    </p>
  </div>
  <div>
    <h4 class="text-sm font-bold mb-1">Running scripts from each other</h4>
    <p class="text-subtle text-sm">
      The <code
        >async Sandbox.runScript(filename: string): Promise&lt;unknown&gt;</code
      >
      function can be used to run your scripts from each other. Note that each script
      is executed in its own async function scope, so you can pass values between
      scripts by using <code>return</code> in one and <code>await</code>
      in the other.
    </p>
  </div>
  <div>
    <h4 class="text-sm font-bold mb-1">Working with the file system</h4>
    <p class="text-subtle text-sm">
      The 'fs' module is not available in the sandbox. To read files into a
      script, upload them to the media folder and use the <code
        >async Sandbox.import(filename: string): Promise&lt;Buffer&gt;</code
      >
      function. To save files to your computer, use the
      <code
        >async Sandbox.download(filename: string, data: string | Buffer)</code
      >
      function.
    </p>
  </div>
</div>

<style lang="scss">
  code {
    font-family: var(--font-mono), monospace;
    color: var(--color-accent);
  }
</style>
