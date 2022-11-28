import DatabaseService from "./database";

export function setupSamples() {
  DatabaseService.setItem("media", "SampleSTBL.stbl", "U1RCTAUAAAIAAAAAAAAAAABBAAAAsUCkagANAEhlbGxvLCBXb3JsZCEi5nFDADIATmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAsIG5ldmVyIGdvbm5hIGxldCB5b3UgZG93bi4");
  DatabaseService.setItem("script", "loadSampleSTBL", `const { StringTableResource } = require("@s4tk/models");\n\nconst buffer = await Sandbox.import("SampleSTBL.stbl");\n\nconst stbl = StringTableResource.from(buffer);\n\nSandbox.output(\`Loaded STBL with \${stbl.size} entries.\`);\n\nreturn stbl;\n`);
  DatabaseService.setItem("script", "helloWorld", `const { Package } = require("@s4tk/models");\nconst { BinaryResourceType, StringTableLocale } = require("@s4tk/models/enums");\nconst { fnv64 } = require("@s4tk/hashing");\n\nconst pkg = new Package();\n\nconst stbl = await Sandbox.runScript("loadSampleSTBL");\n\npkg.add(\n  {\n    type: BinaryResourceType.StringTable,\n    group: 0x80000000,\n    instance: StringTableLocale.getInstanceBase(fnv64("SampleSTBL"))\n  },\n  stbl\n);\n\nSandbox.output(stbl.entries[0].value);\nSandbox.download("SampleSTBL.package", pkg.getBuffer());\n`);
}