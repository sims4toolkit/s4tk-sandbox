<script lang="ts">
  // This file is messy -- it's based on the vertical split view.

  export let bottomPanelName: string;
  export const collapseBottomPanel = () => {
    bottomIsCollapsed = true;
    updatePanelHeights(collapsedBottomHeight);
  };

  const navbarHeight = 0; // this is styled in Navbar
  const collapsedBottomHeight = 25; // this is styled in Navbar
  const bottomCollapsePoint: number = 100;
  const defaultBottomHeight: number = 250; // default bottom height set in styling
  const maxBottomHeightPercent: number = 0.8;

  let resizer: HTMLElement;
  let topPanel: HTMLElement;
  let bottomPanel: HTMLElement;

  let isHoveringResizer: boolean = false;
  let showHighlight: boolean = false;
  let isResizing: boolean = false;
  let bottomIsCollapsed: boolean = false;
  let resizePosition: number = defaultBottomHeight;
  $: useCursorR = isResizing && resizePosition <= bottomCollapsePoint;

  function onMouseEnterResizer() {
    isHoveringResizer = true;
    setTimeout(() => {
      showHighlight = isHoveringResizer;
    }, 350);
  }

  function onMouseLeaveResizer() {
    isHoveringResizer = false;
    showHighlight = false;
  }

  function onMouseDownResizer() {
    isResizing = true;
    showHighlight = true;
  }

  function onMouseUp() {
    isResizing = false;
  }

  function onMouseMove(e: MouseEvent) {
    if (isResizing) {
      resizePosition = window.innerHeight - e.clientY - navbarHeight; // FIXME: probably need to add screen height or something
      if (bottomIsCollapsed) {
        if (resizePosition > bottomCollapsePoint) {
          bottomIsCollapsed = false;
          updatePanelHeights(resizePosition);
        }
      } else {
        if (resizePosition >= bottomCollapsePoint) {
          updatePanelHeights(resizePosition);
        } else if (resizePosition <= bottomCollapsePoint) {
          bottomIsCollapsed = true;
          updatePanelHeights(collapsedBottomHeight);
        }
      }
    }
  }

  function updatePanelHeights(bottomPanelHeight: number) {
    const bottomMaxHeight: number = Math.floor(
      (window.innerHeight - navbarHeight) * maxBottomHeightPercent
    );

    if (bottomPanelHeight > bottomMaxHeight)
      bottomPanelHeight = bottomMaxHeight;
    const topPanelHeight = window.innerHeight - bottomPanelHeight;
    topPanel.style.height = `${topPanelHeight}px`;
    resizer.style.top = `${topPanelHeight - 2}px`; // -2 comes from the offset set in styling
    bottomPanel.style.top = `${topPanelHeight + 2}px`; // + 2 comes from the offset set in styling
  }

  function expandBottomPanel() {
    bottomIsCollapsed = false;
    updatePanelHeights(defaultBottomHeight);
  }
</script>

<div
  class="splitview"
  class:is-resizing={isResizing}
  class:cursor-r={useCursorR}
  on:mouseup={onMouseUp}
  on:mousemove={onMouseMove}
  on:mouseleave={onMouseUp}
>
  <div
    class="top-panel"
    bind:this={topPanel}
    class:prevent-interaction={isResizing}
  >
    <slot name="top" />
  </div>

  <div
    class="resizer"
    class:cursor-r={useCursorR || bottomIsCollapsed}
    bind:this={resizer}
    on:mouseenter={onMouseEnterResizer}
    on:mouseleave={onMouseLeaveResizer}
    on:mousedown={onMouseDownResizer}
    class:highlight={showHighlight || isResizing}
  />

  {#if bottomIsCollapsed}
    <button
      class="collapsed-bottom-panel hoverable"
      draggable="false"
      on:click={expandBottomPanel}
    >
      <span>{bottomPanelName}</span>
    </button>
  {/if}
  <div
    class="bottom-panel w-full"
    bind:this={bottomPanel}
    hidden={bottomIsCollapsed}
    class:prevent-interaction={isResizing}
  >
    <slot name="bottom" />
  </div>
</div>

<style lang="scss">
  $default-bottom-height: 250px;
  $resizer-height: 4px; // this is hardcoded in script
  $resizer-border: 2px;

  .splitview {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;

    &.is-resizing {
      cursor: col-resize;
    }

    .collapsed-bottom-panel,
    .bottom-panel,
    .top-panel,
    .resizer {
      position: absolute;
      left: 0;
      right: 0;
      overflow: hidden;
    }

    .collapsed-bottom-panel {
      height: 25px;
      background-color: var(--color-bg-secondary);
      font-size: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        // writing-mode: vertical-lr;
        // text-orientation: mixed;
        // transform: rotate(-180deg);
        margin-left: 16px;
        opacity: 0.65;

        &:hover {
          cursor: pointer;
          opacity: 1;
        }
      }
    }

    .bottom-panel {
      bottom: 0;
      height: $default-bottom-height;
    }

    .top-panel {
      top: 0;
      bottom: $default-bottom-height + $resizer-border;
    }

    .resizer {
      top: $default-bottom-height - $resizer-height + $resizer-border;
      height: $resizer-height;
      box-sizing: border-box;
      cursor: col-resize;
      border-top: $resizer-border solid var(--color-shadow);
      background-color: transparent;
      z-index: 512;

      &.highlight {
        border-top-color: var(--color-accent);
      }
    }
  }

  .cursor-r {
    cursor: e-resize !important;
  }

  .prevent-interaction {
    pointer-events: none;
    user-select: none;
  }
</style>
