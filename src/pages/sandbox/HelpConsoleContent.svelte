<div class="flex flex-col gap-4 whitespace-normal">
  <div>
    <h4 class="text-sm font-bold mb-1">Available modules</h4>
    <p class="text-subtle text-sm">
      The sandbox runs client-side, so you do not have access to any Node or npm
      modules. The only modules you can import are those listed in the API
      Version Details (located at the top of the file manager panel), plus a
      browserified <code>Buffer</code> class (no import necessary - use it as if
      you're in a Node environment).
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
    <h4 class="text-sm font-bold mb-1">Running scripts from each other</h4>
    <p class="text-subtle text-sm">
      The <code>Sandbox.runScript(filename: string): any</code> function can be used
      to run your scripts from each other. Note that each script is executed in its
      own function scope, and is therefore allowed to return any value it wants.
      To mock export/import behavior, you can simply return a value from one script
      and use that value in the other.
    </p>
  </div>
  <div>
    <h4 class="text-sm font-bold mb-1">Working with the file system</h4>
    <p class="text-subtle text-sm">
      The 'fs' module is not available in the sandbox. To read files into a
      script, upload them to the media folder and use the <code
        >Sandbox.import(filename: string): Buffer</code
      >
      function. To save files to your computer, use the
      <code
        >Sandbox.download(filename: string, data: string | Buffer): void</code
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
