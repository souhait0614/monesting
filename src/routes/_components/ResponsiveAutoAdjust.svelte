<script lang="ts">
  import type TopAppBar from "@smui/top-app-bar";
  import { AutoAdjust } from "@smui/top-app-bar";
  import { isWideLayout } from "$lib/store";

  export let wideLayoutTopAppBar: TopAppBar;
  export let narrowLayoutTopAppBar: TopAppBar;
</script>

{#if $isWideLayout}
  <AutoAdjust topAppBar={wideLayoutTopAppBar}>
    <slot />
  </AutoAdjust>
{:else}
  <AutoAdjust topAppBar={narrowLayoutTopAppBar}>
    <slot />
  </AutoAdjust>
{/if}
