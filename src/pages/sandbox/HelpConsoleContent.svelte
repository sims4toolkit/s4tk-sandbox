<div class="flex flex-col gap-4 whitespace-normal">
  <div>
    <h4 class="text-sm font-bold mb-1">Available modules</h4>
    <p class="text-subtle text-sm">
      This sandbox runs client-side, so you do not have access to any Node or
      npm modules. The only modules you can import are those listed in the API
      Version Details (located at the top of the file manager panel), plus a
      browserified <code>Buffer</code> class (no import necessary - use it as if
      you're in a Node environment).
    </p>
  </div>
  <div>
    <h4 class="text-sm font-bold mb-1">Importing S4TK modules</h4>
    <p class="text-subtle text-sm">
      The available S4TK modules exist on <code>window.S4TK</code>, but
      <code>require(..)</code>
      syntax is supported for convenience. For example, to import the
      <code>Package</code>
      class, you can use either
      <code>const {"{ Package }"} = window.S4TK.models</code>
      or
      <code>const {"{ Package }"} = require("@s4tk/models")</code>.
    </p>
  </div>
  <div>
    <h4 class="text-sm font-bold mb-1">Limitations</h4>
    <p class="text-subtle text-sm">
      @s4tk/plugin-bufferfromfile is not available in this environment, meaning
      that any functionality that requires it will not work. Other than that,
      the entirety of S4TK should work identically to its Node counterpart. If
      you notice any discrepancies, please report them.
    </p>
  </div>
</div>

<style lang="scss">
  code {
    font-family: var(--font-mono), monospace;
    color: var(--color-accent-secondary);
  }
</style>
