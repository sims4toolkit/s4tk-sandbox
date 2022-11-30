/// <reference types="svelte" />

export interface SandboxDownloadItem {
  content: string | Buffer;
  filename: string;
}

export interface SandboxFunctions {
  readonly outputStream: string[];
  readonly downloadQueue: SandboxDownloadItem[];
  mediaOverride?: { [key: string]: string; };

  download(filename: string, content: string | Buffer): Promise<void>;
  import(filename: string): Promise<Buffer>;
  output(...args: string[]): void;
  require(path: string): unknown;
  runScript(filename: string): Promise<unknown>;
  test(name: string, condition: boolean): void;
}

declare global {
  interface Window {
    Sandbox: SandboxFunctions;
    S4TK: any;
    NodeJS: {
      Buffer: typeof Buffer;
    }
  }
}