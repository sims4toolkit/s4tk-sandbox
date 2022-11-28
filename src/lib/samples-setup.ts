import DatabaseService from "./database";

export function setupSamples() {
  DatabaseService.setItem("media", "SampleSTBL.stbl", "U1RCTAUAAAIAAAAAAAAAAAAbAAAAsUCkagAMAEZpcnN0IHN0cmluZyLmcUMADQBTZWNvbmQgc3RyaW5n");
  DatabaseService.setItem("script", "loadSampleSTBL", `const { StringTableResource } = require("@s4tk/models");\n\nconst buffer = await Sandbox.import("SampleSTBL.stbl");\n\nconst stbl = StringTableResource.from(buffer);\n\nSandbox.output(JSON.stringify(stbl.toJsonObject()));\n\nreturn stbl;\n`);
  DatabaseService.setItem("script", "helloWorld", `const { Package } = require("@s4tk/models");\nconst { BinaryResourceType, StringTableLocale } = require("@s4tk/models/enums");\nconst { fnv64 } = require("@s4tk/hashing");\n\nconst pkg = new Package();\n\nconst stbl = await Sandbox.runScript("newStbl");\n\nconst stblInstance = StringTableLocale.setHighByte(StringTableLocale.English, fnv64("SampleSTBL"));\n\npkg.add(\n  {\n    type: BinaryResourceType.StringTable,\n    group: 0x80000000,\n    instance: stblInstance\n  },\n  stbl\n);\n\nSandbox.output(stbl.entries[0].value);\nSandbox.download("SampleSTBL.package", pkg.getBuffer());\n`);
}