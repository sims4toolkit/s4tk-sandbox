import DatabaseService from "src/lib/database";
import Settings from "src/lib/settings";

// FIXME: this should be fetched from somewhere
export const S4TK_API_VERSIONS = [
  "0.1.1",
  "0.1.0"
];

export const S4TK_API_STATE: Partial<{
  version: string;
  specs: { name: string; version: string; }[];
}> = {};

export async function loadApi(version: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      if (S4TK_API_STATE.version === version) return resolve(true);

      const cachedApiVersions = await DatabaseService.getAllKeys("api");
      if (cachedApiVersions.includes(version)) {
        const cachedApi = await DatabaseService.getItem("api", version);
        Function(cachedApi)();
      } else {
        fetchAndCacheApi(version).then((api) => Function(api)());
      }

      const cachedApiSpecsVersions = await DatabaseService.getAllKeys("api_specs");
      if (cachedApiSpecsVersions.includes(version)) {
        const cachedApiSpecs = await DatabaseService.getItem("api_specs", version);
        S4TK_API_STATE.specs = JSON.parse(cachedApiSpecs);
      } else {
        fetchAndCacheApiSpecs(version).then((specs) => S4TK_API_STATE.specs = JSON.parse(specs));
      }

      S4TK_API_STATE.version = version;
      Settings.lastApiVersion = version;

      resolve(true);
    } catch (err) {
      reject(false);
    }
  });
}

//#region Helpers

async function fetchAndCacheApi(version: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    console.log(`Fetching API version ${version}.`);

    const url = `https://raw.githubusercontent.com/sims4toolkit/browserfied/version/${version}/build/s4tk.min.js`;

    fetch(url)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        DatabaseService.setItem("api", version, text);
        resolve(text);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function fetchAndCacheApiSpecs(version: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    console.log(`Fetching specs for API version ${version}.`);

    const url = `https://raw.githubusercontent.com/sims4toolkit/browserfied/version/${version}/build/s4tk.specs.json`;

    fetch(url)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        DatabaseService.setItem("api_specs", version, text);
        resolve(text);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

//#endregion Helpers
