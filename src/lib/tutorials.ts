const REPO_URL_BASE = "https://raw.githubusercontent.com/sims4toolkit/sandbox-tutorials/main";
const TUTORIALS_FOLDER = "tutorials";
const INDEX_FILENAME = "index.json";

export interface TutorialsIndex {
  version: number;
  tutorials: {
    [key: string]: {
      name: string;
      description: string;
      requiredApiVersion: string;
    };
  };
}

export interface Tutorial {
  guide: string;
  script: string;
}

let tutorialsIndex: TutorialsIndex;
let tutorialsMap = new Map<string, Tutorial>();

export async function fetchTutorialsIndex(): Promise<TutorialsIndex> {
  return new Promise((resolve, reject) => {
    if (tutorialsIndex) return resolve(tutorialsIndex);

    fetch(`${REPO_URL_BASE}/${INDEX_FILENAME}`)
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
      const scriptRes = await fetch(`${REPO_URL_BASE}/${TUTORIALS_FOLDER}/${key}.js`);
      if (!scriptRes.ok) return reject(scriptRes.statusText);
      const script = await scriptRes.text();

      const guideRes = await fetch(`${REPO_URL_BASE}/${TUTORIALS_FOLDER}/${key}.md`);
      if (!guideRes.ok) return reject(guideRes.statusText);
      const guide = await guideRes.text();

      const tutorial: Tutorial = { script, guide };
      tutorialsMap.set(key, tutorial);
      resolve(tutorial);
    } catch (err) {
      reject(err);
    }
  });
}
