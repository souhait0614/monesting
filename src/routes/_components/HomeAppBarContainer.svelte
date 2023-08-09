<script lang="ts">
  import BottomAppBar, { AutoAdjust as BottomAutoAdjust, Section as BottomSection } from "@smui-extra/bottom-app-bar";
  import TopAppBar, { Section as TopSection, AutoAdjust as TopAutoAdjust, Row } from "@smui/top-app-bar";
  import IconButton, { Icon } from "@smui/icon-button";
  import List, { Graphic, Item, Label, Separator, Text } from "@smui/list";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Button from "@smui/button/src/Button.svelte";
  import Radio from "@smui/radio";
  import AddItemFab from "./AddItemFab.svelte";
  import { isWideLayout, openAddItemModal } from "$lib/store";
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

  let openSortItemDialog = false;

  export let exitedFab = false;
  export let showSignedInContent = false;

  let topAppBar: TopAppBar;
  let bottomAppBar: BottomAppBar;
</script>

{#if $isWideLayout}
  {#if showSignedInContent}
    <TopAppBar bind:this={topAppBar} variant="fixed" class="home-top-app-bar" style="width: calc(100% - 256px)">
      <Row>
        <TopSection>
          <Button
            variant="unelevated"
            on:click={() => {
              $openAddItemModal = true;
            }}
          >
            <Icon class="material-icons">add</Icon>
            <Label>追加</Label>
          </Button>
        </TopSection>
        <TopSection align="end" toolbar>
          <IconButton
            class="material-icons"
            on:click={() => {
              openSortItemDialog = true;
            }}>sort</IconButton
          >
        </TopSection>
      </Row>
    </TopAppBar>
  {/if}
  <TopAutoAdjust {topAppBar}>
    <slot />
  </TopAutoAdjust>
{:else}
  <BottomAutoAdjust {bottomAppBar}>
    <slot />
  </BottomAutoAdjust>
  <BottomAppBar bind:this={bottomAppBar} color="secondary" variant="fixed">
    <BottomSection>
      <IconButton
        class="material-icons"
        on:click={() => {
          $openMenuDrawer = true;
        }}>menu</IconButton
      >
    </BottomSection>
    <BottomSection fabInset={!exitedFab}>
      <AddItemFab exited={exitedFab} />
    </BottomSection>
    <BottomSection>
      {#if showSignedInContent}
        <IconButton
          class="material-icons"
          on:click={() => {
            openSortItemDialog = true;
          }}>sort</IconButton
        >
      {/if}
    </BottomSection>
  </BottomAppBar>
{/if}

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
