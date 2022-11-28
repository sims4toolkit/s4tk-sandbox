
export interface SandboxFunctions {
  readonly outputStream: string[];

  download(filename: string, content: string | Buffer): Promise<void>;
  import(filename: string): Promise<Buffer>;
  output(...args: string[]): void;
  require(path: string): unknown;
  runScript(filename: string): Promise<unknown>;
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
