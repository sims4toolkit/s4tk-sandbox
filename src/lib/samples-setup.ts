import FileManager from "src/lib/file-manager";

export async function setupSamples() {
  const mediaFm = FileManager.getInstance("media");
  await mediaFm.tryAdd("SampleSTBL.stbl", "U1RCTAUAAAIAAAAAAAAAAABBAAAAsUCkagANAEhlbGxvLCBXb3JsZCEi5nFDADIATmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAsIG5ldmVyIGdvbm5hIGxldCB5b3UgZG93bi4");

  const scriptFm = FileManager.getInstance("script");
  await scriptFm.tryAdd("loadSampleSTBL", `const { StringTableResource } = require("@s4tk/models");\n\nconst buffer = await Sandbox.import("SampleSTBL.stbl");\n\nconst stbl = StringTableResource.from(buffer);\n\nSandbox.output(\`Loaded STBL with \${stbl.size} entries.\`);\n\nreturn stbl;\n`);
  await scriptFm.tryAdd("helloWorld", `const { Package } = require("@s4tk/models");\nconst { BinaryResourceType, StringTableLocale } = require("@s4tk/models/enums");\nconst { fnv64 } = require("@s4tk/hashing");\n\nconst pkg = new Package();\n\nconst stbl = await Sandbox.runScript("loadSampleSTBL");\n\npkg.add(\n  {\n    type: BinaryResourceType.StringTable,\n    group: 0x80000000,\n    instance: StringTableLocale.getInstanceBase(fnv64("SampleSTBL"))\n  },\n  stbl\n);\n\nSandbox.output(stbl.entries[0].value);\nSandbox.download("SampleSTBL.package", pkg.getBuffer());\n`);
}