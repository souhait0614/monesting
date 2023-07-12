<script lang="ts">
  import BottomAppBar, { Section } from "@smui-extra/bottom-app-bar";
  import IconButton from "@smui/icon-button";
  import Fab, { Icon } from "@smui/fab";
  import { openMenuDrawer } from "./store";

  export let bottomAppBar: BottomAppBar;
  export let disableControlItems = false;
</script>

<BottomAppBar bind:this={bottomAppBar} color="secondary">
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
      <Fab aria-label="Add" color="primary">
        <Icon class="material-icons">add</Icon>
      </Fab>
    </Section>
    <Section>
      <IconButton class="material-icons">sort</IconButton>
    </Section>
  {/if}
</BottomAppBar>
