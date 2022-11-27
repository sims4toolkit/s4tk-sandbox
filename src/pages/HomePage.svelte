<script lang="ts">
  import Footer from "src/components/Footer.svelte";

  async function fetchS4TK(version: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      // FIXME: cache with indexed DB, not local storage

      const storageKey = `s4tk-api-${version}`;
      const cached = localStorage.getItem(storageKey);

      if (cached) return resolve(cached);

      fetch(
        `https://raw.githubusercontent.com/sims4toolkit/browserfied/version/${version}/build/s4tk.min.js`
      )
        .then((res) => {
          res.text().then((text) => {
            localStorage.setItem(storageKey, text);
            resolve(text);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  (async () => {
    const s4tkApi = await fetchS4TK("0.1.0");
    eval(s4tkApi);
  })();
</script>

<svelte:head>
  <title>Sandbox</title>
</svelte:head>

<section class="pt-10 flex-1 w-full flex justify-center">
  <div class="w-full xl:max-w-screen-xl px-4 flex flex-col justify-center">
    <a href="#/code">Go to Sandbox</a>
  </div>
</section>
<Footer />
