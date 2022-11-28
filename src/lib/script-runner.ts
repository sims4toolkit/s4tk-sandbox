import saveAs from "file-saver";
import { hyphenToCamel } from "src/lib/helpers";
import DatabaseService from "src/lib/database";
import type { SandboxFunctions } from "src/window";

const SCRIPT_HEADER = "const Buffer = window.NodeJS.Buffer;const Sandbox = window.Sandbox;const require = Sandbox.require;";

export async function runScript(filename: string): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const userScript = await DatabaseService.getItem("script", filename);
      if (!userScript)
        throw new Error(`Script '${filename}' either does not exist or is empty.`);
      const asyncFn = Function(`return new Promise(async (resolve, reject) => { (async () => { ${SCRIPT_HEADER}${userScript} })().then(r => resolve(r)).catch(err => reject(err)); });`);
      const result = await asyncFn();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

let outputFilenamePrefix = "";
const outputStream: string[] = [];
const Sandbox: SandboxFunctions = {
  outputStream,
  async download(filename: string, content: string | Buffer) {
    Sandbox.output(`Downloading '${filename}'...`);
    saveAs(new Blob([content]), filename);
  },
  async import(filename: string): Promise<Buffer> {
    const b64 = await DatabaseService.getItem("media", filename);
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
    outputFilenamePrefix = filename;

    let result: any;

    try {
      result = await runScript(filename);
    } catch (err) {
      Sandbox.output(err);
    }

    outputFilenamePrefix = undefined;
    return result;
  }
};

window.Sandbox = Sandbox;
