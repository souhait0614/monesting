<script lang="ts">
  import Fab, { Icon } from "@smui/fab";
  import { openAddItemModal } from "$lib/store";

  export let exited = false;
</script>

<Fab
  aria-label="Add"
  color="primary"
  {exited}
  on:click={() => {
    $openAddItemModal = true;
  }}
>
  <Icon class="material-icons">add</Icon>
</Fab>
