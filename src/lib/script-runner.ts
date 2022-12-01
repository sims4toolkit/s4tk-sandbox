import { hyphenToCamel } from "src/lib/helpers";
import DatabaseService from "src/lib/database";
import type { SandboxDownloadItem, SandboxFunctions } from "src/global";

const SCRIPT_HEADER = "const Buffer = window.NodeJS.Buffer;const Sandbox = window.Sandbox;const require = Sandbox.require;";

type SandboxContext = "filesystem" | "tutorial";

let currentSandboxContext: SandboxContext = "filesystem";

export async function runScript(filename: string, script: string, context?: SandboxContext): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    if (context) currentSandboxContext = context;

    try {
      if (!script)
        throw new Error(`Script '${filename}' either does not exist or is empty.`);
      const asyncFn = Function(`return new Promise(async (resolve, reject) => { (async () => { ${SCRIPT_HEADER}${script} })().then(r => resolve(r)).catch(err => reject(err)); });`);
      const result = await asyncFn();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

let outputFilenamePrefix = "";
const outputStream: string[] = [];
const downloadQueue: SandboxDownloadItem[] = [];
const Sandbox: SandboxFunctions = {
  outputStream,
  downloadQueue,
  async download(filename: string, content: string | Buffer) {
    Sandbox.output(`Queueing '${filename}' for download`);
    downloadQueue.push({ filename, content });
  },
  async import(filename: string): Promise<Buffer> {
    if (currentSandboxContext === "filesystem") {
      var b64 = await DatabaseService.getItem("media", filename);
    } else {
      var b64 = Sandbox.mediaOverride[filename];
    }

    if (!b64) Sandbox.output(`Media file '${filename}' does not exist in this context.`);

    return window.NodeJS.Buffer.from(b64, "base64");
  },
  output(...args: string[]) {
    if (outputFilenamePrefix) {
      outputStream.push(...args.map(arg => `[@${outputFilenamePrefix}] ${arg}`));
    } else {
      outputStream.push(...args);
    }
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
  async runScript(filename: string): Promise<unknown> {
    return new Promise(async (resolve, reject) => {
      if (currentSandboxContext === "tutorial") {
        return reject("Sandbox.runScript() is unavailable in tutorials.");
      }

      outputFilenamePrefix = filename;

      let result: any;

      try {
        const script = await DatabaseService.getItem("script", filename);
        result = await runScript(filename, script);
      } catch (err) {
        Sandbox.output(err);
      }

      outputFilenamePrefix = undefined;
      resolve(result);
    });
  },
  test(name: string, condition: boolean) {
    if (condition) {
      Sandbox.output(`Test '${name}' passed`);
    } else {
      Sandbox.output(`TEST FAILED: Test '${name}' did not pass`);
    }
  }
};

window.Sandbox = Sandbox;
