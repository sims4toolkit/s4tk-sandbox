<script lang="ts">
  import FileList from "./FileList.svelte";

  let scriptFilenames: string[] = ["sample"];
  let mediaFilenames: string[] = [];

  function handleMediaFileClick(filename: string) {
    alert("media" + filename);
  }

  function handleScriptFileClick(filename: string) {
    alert("script" + filename);
  }

  function handleMediaAdd() {
    alert("media add");
  }

  function handleMediaDelete() {
    alert("media delete");
  }

  function handleScriptAdd() {
    alert("script add");
  }

  function handleScriptDelete() {
    alert("script delete");
  }
</script>

<div class="h-full overflow-y-auto">
  <FileList
    expanded={true}
    title="Scripts"
    filenames={scriptFilenames}
    onClick={handleScriptFileClick}
    onAdd={handleScriptAdd}
    onDelete={handleScriptDelete}
  />
  <FileList
    title="Media"
    filenames={mediaFilenames}
    onClick={handleMediaFileClick}
    onAdd={handleMediaAdd}
    onDelete={handleMediaDelete}
  />
</div>
