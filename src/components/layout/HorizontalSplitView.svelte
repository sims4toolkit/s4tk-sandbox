<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  const MIN_HEIGHT = 50;
  const COLLAPSED_HEIGHT = 30;

  export let bottomPanelName: string;
  export let defaultBottomHeight: number = 200;

  // elements
  let panelWrapper: HTMLDivElement;
  let topPanel: HTMLDivElement;
  let bottomPanel: HTMLDivElement;
  let collapsedBottomPanel: HTMLButtonElement;

  // state
  let isHoveringResizer = false;
  let isResizing = false;
  let isCollapsed = false;

  onMount(() => {
    window.addEventListener("resize", reactToResize);

    const wrapperRect = panelWrapper.getBoundingClientRect();
    topPanel.style.height = `${wrapperRect.height - defaultBottomHeight}px`;
    bottomPanel.style.height = `${defaultBottomHeight}px`;
    collapsedBottomPanel.style.height = `${COLLAPSED_HEIGHT}px`;
  });

  onDestroy(() => {
    window.removeEventListener("resize", reactToResize);
  });

  function reactToResize() {
    const wrapperRect = panelWrapper.getBoundingClientRect();
    const bottomRect = bottomPanel.getBoundingClientRect();
    topPanel.style.height = `${wrapperRect.height - bottomRect.height}px`;
  }

  function handleMouseMove(e: MouseEvent) {
    if (isCollapsed) return;

    if (isResizing) {
      const wrapperRect = panelWrapper.getBoundingClientRect();
      const topHeight = e.clientY - wrapperRect.top;
      const bottomHeight = wrapperRect.height - topHeight;

      if (topHeight < MIN_HEIGHT) return;
      if (bottomHeight < MIN_HEIGHT) {
        isCollapsed = true;
        isResizing = false;
        isHoveringResizer = false;
        topPanel.style.height = `${wrapperRect.height - COLLAPSED_HEIGHT}px`;
        return;
      }

      topPanel.style.height = `${topHeight}px`;
      bottomPanel.style.height = `${bottomHeight}px`;
    } else {
      const bottomRect = bottomPanel.getBoundingClientRect();
      if (e.clientY >= bottomRect.top && e.clientY <= bottomRect.top + 4) {
        isHoveringResizer = true;
      } else {
        isHoveringResizer = false;
      }
    }
  }

  function handleMouseDown(e: MouseEvent) {
    if (isHoveringResizer) isResizing = true;
  }

  function handleMouseUp(e: MouseEvent) {
    isResizing = false;
  }

  function handleCollapsedClick() {
    isCollapsed = false;
    const wrapperRect = panelWrapper.getBoundingClientRect();
    topPanel.style.height = `${wrapperRect.height - defaultBottomHeight}px`;
    bottomPanel.style.height = `${defaultBottomHeight}px`;
  }
</script>

<div
  bind:this={panelWrapper}
  class="absolute top-0 bottom-0 left-0 right-0"
  class:cursor-row-resize={isHoveringResizer}
  on:mousemove={handleMouseMove}
  on:mousedown={handleMouseDown}
  on:mouseup={handleMouseUp}
  class:select-none={isResizing}
>
  <div
    bind:this={topPanel}
    class="absolute top-0 left-0 right-0 overflow-hidden"
  >
    <slot name="top" />
  </div>

  <div
    bind:this={bottomPanel}
    hidden={isCollapsed}
    class="absolute bottom-0 left-0 right-0 overflow-hidden border-t-2"
    class:border-t-gray-600={!isHoveringResizer}
    class:dark:border-t-gray-950={!isHoveringResizer}
    class:border-t-accent-primary-light={isHoveringResizer}
    class:dark:border-t-accent-primary-dark={isHoveringResizer}
  >
    <slot name="bottom" />
  </div>
  <button
    bind:this={collapsedBottomPanel}
    hidden={!isCollapsed}
    class="absolute bottom-0 left-0 right-0 items-center pl-2 border-t-2 border-t-gray-600 dark:border-t-gray-950 select-none"
    class:flex={isCollapsed}
    on:click={handleCollapsedClick}
  >
    <p class="text-xs uppercase text-subtle">{bottomPanelName}</p>
  </button>
</div>
