<script lang="ts">
  import DatabaseService from "src/lib/database";

  async function clearCache() {
    if (
      confirm(
        `This will delete all of the S4TK API versions that have been cached in your browser, and the page with reload and re-fetch the API from the server. Are you sure you want to continue?`
      )
    ) {
      await DatabaseService.clear("api");
      await DatabaseService.clear("api_specs");
      location.reload();
    }
  }

  async function deleteMedia() {
    if (
      confirm(
        `This will delete all of your media files, and there is no way to recover them. Are you sure you want to continue?`
      )
    ) {
      await DatabaseService.clear("media");
      location.reload();
    }
  }

  async function deleteScripts() {
    if (
      confirm(
        `This will delete all of your scripts, and there is no way to recover them. Are you sure you want to continue?`
      )
    ) {
      await DatabaseService.clear("script");
      location.reload();
    }
  }
</script>

<div class="flex gap-4">
  <button
    class="text-red-600 dark:text-red-500 border border-solid border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-gray-900 px-2 py-1 rounded"
    on:click={deleteScripts}>Delete Scripts</button
  >
  <button
    class="text-red-600 dark:text-red-500 border border-solid border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-gray-900 px-2 py-1 rounded"
    on:click={deleteMedia}>Delete Media</button
  >
  <button
    class="text-red-600 dark:text-red-500 border border-solid border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-gray-900 px-2 py-1 rounded"
    on:click={clearCache}>Clear Cache</button
  >
</div>
