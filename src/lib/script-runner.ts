import saveAs from "file-saver";
import { hyphenToCamel } from "src/lib/helpers";

export function runScript(script: string, output: string[]) {
  try {
    Sandbox.output = (...args: string[]) => {
      output.push(...args);
    };

    Sandbox.runScript = (filename: string) => {
      const importedScript = Sandbox.import(filename).toString();
      const innerOutput: string[] = [];
      runScript(importedScript, innerOutput);
      output.push(...innerOutput.map(line => `[@${filename}] ${line}`));
    };

    const code = `const Buffer = window.Node.Buffer;const Sandbox = window.Sandbox;const require = Sandbox.require;${script}`;

    Function(code)();
  } catch (err) {
    output.push(err);
  }
}

interface SandboxFunctions {
  download(filename: string, content: string | Buffer): Promise<void>;
  import(filename: string): Buffer;
  output?(...args: string[]): void;
  require(path: string): unknown;
  runScript?(filename: string): void;
}

const Sandbox: SandboxFunctions = {
  async download(filename: string, content: string | Buffer) {
    Sandbox.output(`Downloading '${filename}'...`);
    saveAs(new Blob([content]), filename);
  },
  import(filename: string): Buffer {
    Sandbox.output(`Importing '${filename}'...`);
    // TODO: import media
    return undefined;
  },
  require(path: string): unknown {
    try {
      if (path === "fs" || path === "path")
        throw new Error(
          `The Node file system is unavailable in this environment. Use Sandbox.import(filename) and Sandbox.download(filename, data) to interact with files.`
        );

      const moduleNames = path.replace("@s4tk/", "").split("/");

      let moduleValue: any;
      for (let i = 0; i < moduleNames.length; ++i) {
        const moduleName = hyphenToCamel(moduleNames[i]);

        if (moduleValue) {
          moduleValue = moduleValue[moduleName];
        } else {
          //@ts-ignore
          moduleValue = window.S4TK[moduleName];
        }

        if (moduleValue == undefined)
          throw new Error(
            `Could not resolve '${path}' as an S4TK module. Note that Node modules are not available in this environment. Use Sandbox.runScript() to run another script file.`
          );
      }

      return moduleValue;
    } catch (err) {
      Sandbox.output(err);
    }
  },
};

//@ts-ignore
window.Sandbox = Sandbox;
