<script lang="ts">
  import BottomAppBar, { Section } from "@smui-extra/bottom-app-bar";
  import IconButton from "@smui/icon-button";
  import Fab, { Icon } from "@smui/fab";
  import EditItemModal from "./EditItemModal.svelte";
  import { openMenuDrawer } from "$lib/store";

  let openEditItemModal = false;

  export let bottomAppBar: BottomAppBar;
  export let disableControlItems = false;
  export let exitedFab = false
</script>

<BottomAppBar bind:this={bottomAppBar} color="secondary" variant="fixed">
  <Section>
    <IconButton
      class="material-icons"
      on:click={() => {
        $openMenuDrawer = true;
      }}>menu</IconButton
    >
  </Section>
  {#if !disableControlItems}
    <Section fabInset>
      <Fab
        aria-label="Add"
        color="primary"
        exited={exitedFab}
        on:click={() => {
          openEditItemModal = true;
        }}
      >
        <Icon class="material-icons">add</Icon>
      </Fab>
    </Section>
    <Section>
      <!-- <IconButton class="material-icons">sort</IconButton> -->
    </Section>
  {/if}
</BottomAppBar>

{#if openEditItemModal}
  <EditItemModal bind:open={openEditItemModal} mode="add" />
{/if}
