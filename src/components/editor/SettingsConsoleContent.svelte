<script lang="ts">
  import DatabaseService from "src/lib/database";
  import Settings from "src/lib/settings";

  async function clearApiCache() {
    if (
      confirm(
        `This will delete all of the cached S4TK API versions in your browser, and your current version will be re-fetched from the server. Are you sure you want to continue?`
      )
    ) {
      await DatabaseService.clear("api");
      await DatabaseService.clear("api_specs");
      location.reload();
    }
  }

  async function deleteUserData() {
    if (
      confirm(
        `This will permanently delete all of your scripts and media files, and there is no way to recover them. Are you sure you want to continue?`
      )
    ) {
      await DatabaseService.clear("media");
      await DatabaseService.clear("script");
      Settings.hasSeenExampleScript = false;
      location.reload();
    }
  }
</script>

<div class="flex gap-4">
  <button
    class="text-red-600 dark:text-red-500 border border-solid border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-gray-900 px-2 py-1 rounded"
    on:click={clearApiCache}>Clear API Cache</button
  >
  <button
    class="text-red-600 dark:text-red-500 border border-solid border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-gray-900 px-2 py-1 rounded"
    on:click={deleteUserData}>Delete User Data</button
  >
</div>
