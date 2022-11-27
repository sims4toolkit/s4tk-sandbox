<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  const MIN_WIDTH = 60;
  const COLLAPSED_WIDTH = 30;

  export let leftPanelName: string;

  // elements
  let panelWrapper: HTMLDivElement;
  let leftPanel: HTMLDivElement;
  let rightPanel: HTMLDivElement;
  let collapsedLeftPanel: HTMLButtonElement;

  // state
  let isHoveringResizer = false;
  let isResizing = false;
  let isCollapsed = false;

  onMount(() => {
    window.addEventListener("resize", reactToResize);

    const leftWidth = 300;
    const wrapperRect = panelWrapper.getBoundingClientRect();
    leftPanel.style.width = `${leftWidth}px`;
    rightPanel.style.width = `${wrapperRect.width - leftWidth}px`;
    collapsedLeftPanel.style.width = `${COLLAPSED_WIDTH}px`;
  });

  onDestroy(() => {
    window.removeEventListener("resize", reactToResize);
  });

  function reactToResize() {
    const wrapperRect = panelWrapper.getBoundingClientRect();
    const leftRect = leftPanel.getBoundingClientRect();
    rightPanel.style.width = `${wrapperRect.width - leftRect.width}px`;
  }

  function handleMouseMove(e: MouseEvent) {
    if (isCollapsed) return;

    if (isResizing) {
      const wrapperRect = panelWrapper.getBoundingClientRect();
      const leftWidth = e.clientX - wrapperRect.left;
      const rightWidth = wrapperRect.width - leftWidth;

      if (rightWidth < MIN_WIDTH) return;
      if (leftWidth < MIN_WIDTH) {
        isCollapsed = true;
        isResizing = false;
        isHoveringResizer = false;
        rightPanel.style.width = `${wrapperRect.width - COLLAPSED_WIDTH}px`;
        return;
      }

      leftPanel.style.width = `${leftWidth}px`;
      rightPanel.style.width = `${rightWidth}px`;
    } else {
      const leftRect = leftPanel.getBoundingClientRect();
      if (e.clientX >= leftRect.right - 4 && e.clientX <= leftRect.right) {
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
    leftPanel.style.width = `${MIN_WIDTH + 10}px`;
    rightPanel.style.width = `${wrapperRect.width - MIN_WIDTH - 10}px`;
  }
</script>

<div
  bind:this={panelWrapper}
  class="absolute top-0 bottom-0 left-0 right-0 whitespace-nowrap"
  class:cursor-col-resize={isHoveringResizer}
  class:select-none={isResizing}
  on:mousemove={handleMouseMove}
  on:mousedown={handleMouseDown}
  on:mouseup={handleMouseUp}
>
  <div
    bind:this={leftPanel}
    hidden={isCollapsed}
    class="absolute top-0 bottom-0 left-0 overflow-hidden border-r-2"
    class:border-r-gray-600={!isHoveringResizer}
    class:dark:border-r-gray-950={!isHoveringResizer}
    class:border-r-accent-primary-light={isHoveringResizer}
    class:dark:border-r-accent-primary-dark={isHoveringResizer}
  >
    <slot name="left" />
  </div>
  <button
    bind:this={collapsedLeftPanel}
    hidden={!isCollapsed}
    class="absolute top-0 bottom-0 left-0 justify-center pt-2 border-r-2 border-r-gray-600 dark:border-r-gray-950 select-none"
    class:flex={isCollapsed}
    on:click={handleCollapsedClick}
  >
    <p class="text-sm text-subtle collapsed-p">{leftPanelName}</p>
  </button>

  <div
    bind:this={rightPanel}
    class="absolute top-0 bottom-0 right-0 overflow-hidden"
  >
    <slot name="right" />
  </div>
</div>

<style lang="scss">
  p.collapsed-p {
    writing-mode: vertical-lr;
    text-orientation: mixed;
    transform: rotate(-180deg);
  }
</style>
