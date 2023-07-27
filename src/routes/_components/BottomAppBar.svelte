<script lang="ts">
  import BottomAppBar, { Section } from "@smui-extra/bottom-app-bar";
  import IconButton from "@smui/icon-button";
  import Fab, { Icon } from "@smui/fab";
  import List, { Graphic, Item, Separator, Text } from "@smui/list";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Button from "@smui/button/src/Button.svelte";
  import Radio from "@smui/radio";
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
  let openSortItemDialog = false;

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
    <Section fabInset={!exitedFab}>
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
      <IconButton
        class="material-icons"
        on:click={() => {
          openSortItemDialog = true;
        }}>sort</IconButton
      >
    </Section>
  {/if}
</BottomAppBar>

<Dialog bind:open={openSortItemDialog} selection>
  <Title>ソート</Title>
  <Content>
    <List radioList>
      {#each Object.values(SORT_BY) as by (by)}
        <Item>
          <Graphic>
            <Radio bind:group={$sortBy} value={by} />
          </Graphic>
          <Text>{sortByNames[by]}</Text>
        </Item>
      {/each}
      <Separator />
      {#each Object.values(SORT_ORDER) as order (order)}
        <Item>
          <Graphic>
            <Radio bind:group={$sortOrder} value={order} />
          </Graphic>
          <Text>{sortOrderNames[order]}</Text>
        </Item>
      {/each}
    </List>
  </Content>
  <Actions>
    <Button>閉じる</Button>
  </Actions>
</Dialog>

{#if openEditItemModal}
  <EditItemModal bind:open={openEditItemModal} mode="add" />
{/if}
