<script lang="ts">
  import BottomAppBar, { Section } from "@smui-extra/bottom-app-bar";
  import IconButton from "@smui/icon-button";
  import Fab, { Icon } from "@smui/fab";
  import Menu, { SelectionGroup, SelectionGroupIcon } from "@smui/menu";
  import List, { Item, Separator, Subheader, Text } from "@smui/list";
  import EditItemModal from "./EditItemModal.svelte";
  import { openMenuDrawer, sortBy, sortOrder } from "$lib/store";
  import { SORT_BY, SORT_ORDER } from "$lib/const";

  const sortByNames = {
    date: "請求日",
    name: "名前",
  } as const satisfies Record<SORT_BY, string>;
  const sortOrderNames = {
    asc: "昇順",
    desc: "降順",
  } as const satisfies Record<SORT_ORDER, string>;

  let openEditItemModal = false;

  let sortMenu: Menu;

  export let bottomAppBar: BottomAppBar;
  export let disableControlItems = false;
  export let exitedFab = false;
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
      <Menu bind:this={sortMenu} anchorCorner="BOTTOM_LEFT">
        <List>
          <SelectionGroup>
            <Subheader>ソート</Subheader>
            {#each Object.values(SORT_BY) as by (by)}
              <Item
                on:SMUI:action={() => {
                  $sortBy = by;
                }}
                selected={$sortBy === by}
              >
                <SelectionGroupIcon>
                  <Icon class="material-icons">check</Icon>
                </SelectionGroupIcon>
                <Text>{sortByNames[by]}</Text>
              </Item>
            {/each}
          </SelectionGroup>
          <Separator />
          <SelectionGroup>
            <Subheader>並び順</Subheader>
            {#each Object.values(SORT_ORDER) as order (order)}
              <Item
                on:SMUI:action={() => {
                  $sortOrder = order;
                }}
                selected={$sortOrder === order}
              >
                <SelectionGroupIcon>
                  <Icon class="material-icons">check</Icon>
                </SelectionGroupIcon>
                <Text>{sortOrderNames[order]}</Text>
              </Item>
            {/each}
          </SelectionGroup>
        </List>
      </Menu>
      <IconButton
        class="material-icons"
        on:click={() => {
          sortMenu.setOpen(true);
        }}>sort</IconButton
      >
    </Section>
  {/if}
</BottomAppBar>

{#if openEditItemModal}
  <EditItemModal bind:open={openEditItemModal} mode="add" />
{/if}
