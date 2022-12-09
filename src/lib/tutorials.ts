const URL_BASE = "https://raw.githubusercontent.com/sims4toolkit/sandbox-tutorials/prod/generated";
// const URL_BASE = "http://127.0.0.1:5500/generated";
const TUTORIALS_FOLDER = "tutorials";
const INDEX_FILENAME = "index.json";

export interface TutorialsIndex {
  version: number;
  tags: string[];
  tutorials: { [key: string]: TutorialMetaData; };
}

export interface TutorialMetaData {
  key: string;
  name: string;
  description: string;
  docs?: string;
  apiVersion: string;
  recommended?: boolean;
  tags: string[];
}

export interface Tutorial {
  key: string;
  media: { [key: string]: string; };
  pages: {
    script: string;
    guide: string;
  }[];
}

let tutorialsIndex: TutorialsIndex;
let tutorialsMap = new Map<string, Tutorial>();

export async function fetchTutorialsIndex(): Promise<TutorialsIndex> {
  return new Promise((resolve, reject) => {
    if (tutorialsIndex) return resolve(tutorialsIndex);

    fetch(`${URL_BASE}/${INDEX_FILENAME}`)
      .then(res => {
        if (res.ok)
          return res.json();
        else
          reject(res.statusText);
      })
      .then(json => {
        tutorialsIndex = json;
        resolve(json);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function fetchTutorial(key: string): Promise<Tutorial> {
  return new Promise(async (resolve, reject) => {
    if (tutorialsMap.has(key)) return resolve(tutorialsMap.get(key));

    try {
      const res = await fetch(`${URL_BASE}/${TUTORIALS_FOLDER}/${key}.json`);
      if (!res.ok) return reject(res.statusText);
      const tutorial: Tutorial = await res.json();
      tutorialsMap.set(key, tutorial);
      resolve(tutorial);
    } catch (err) {
      reject(err);
    }
  });
}
