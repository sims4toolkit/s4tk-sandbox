import type { ObjectStore } from "src/lib/database";
import DatabaseService from "src/lib/database";

export default class FileManager {
  private _filenamesList?: string[];
  public get filenames(): string[] {
    return this._filenamesList ??= [...this._filenames].sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  }

  private constructor(
    private readonly _dbStore: ObjectStore,
    private readonly _filenames: Set<string>
  ) { }

  public static async initialize(dbStore: ObjectStore): Promise<FileManager> {
    return new Promise(async (resolve) => {
      const filenames = await DatabaseService.getAllKeys(dbStore);
      const fm = new FileManager(dbStore, new Set(filenames));
      resolve(fm);
    });
  }

  async getFileContent(filename: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!this._filenames.has(filename))
        return reject(`Filename '${filename}' does not exist.`);

      DatabaseService
        .getItem(this._dbStore, filename)
        .then(content => resolve(content))
        .catch(err => reject(err));
    });
  }

  hasFile(filename: string): boolean {
    return this._filenames.has(filename);
  }

  async tryAdd(filename: string, content: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this._filenames.has(filename))
        return reject(`Filename '${filename}' already exists.`);

      DatabaseService.setItem(this._dbStore, filename, content);
      this._filenames.add(filename);

      this._filenamesList = undefined;

      resolve();
    });
  }

  async tryDelete(...filenames: string[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < filenames.length; ++i) {
        const filename = filenames[i];

        if (!this._filenames.has(filename))
          return reject(`Filename '${filename}' does not exist.`);

        DatabaseService.removeItem(this._dbStore, filename);
        this._filenames.delete(filename);
      }

      this._filenamesList = undefined;

      resolve();
    });
  }

  async tryRename(oldName: string, newName: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (oldName === newName) return resolve();

      if (!this._filenames.has(oldName))
        return reject(`Filename '${oldName}' does not exist.`);
      if (this._filenames.has(newName))
        return reject(`Filename '${newName}' already exists.`);

      const content = await DatabaseService.getItem(this._dbStore, oldName);

      DatabaseService.removeItem(this._dbStore, oldName);
      this._filenames.delete(oldName);

      DatabaseService.setItem(this._dbStore, newName, content);
      this._filenames.add(newName);

      this._filenamesList = undefined;

      resolve();
    });
  }
}