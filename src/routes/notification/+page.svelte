<script lang="ts">
  import Button, { Icon, Label } from "@smui/button";
  import { createMutation, createQuery, useIsMutating } from "@tanstack/svelte-query";
  import TopAppBar, { Row, Section } from "@smui/top-app-bar";
  import IconButton from "@smui/icon-button";
  import Menu from "@smui/menu";
  import List, { Item as ListItem } from "@smui/list";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Snackbar, { Label as SnackbarLabel } from "@smui/snackbar";
  import equal from "fast-deep-equal";
  import Fab from "@smui/fab";
  import NotificationCard from "../_components/NotificationCard.svelte";
  import BackHomeAppBar from "../_components/BackHomeAppBar.svelte";
  import ResponsiveAutoAdjust from "../_components/ResponsiveAutoAdjust.svelte";
  import Loading from "../_components/Loading.svelte";
  import type { NotificationV1 } from "../../types/NotificationV1";
  import type { NotificationDataV1 } from "../../types/NotificationData";
  import type { PageData } from "./$types";
  import Subscribe from "./Subscribe.svelte";
  import { getItemData, setNotificationData } from "$lib/fetch";
  import { browser } from "$app/environment";
  import { MUTATION_KEYS, QUERY_KEYS } from "$lib/const";
  import { isSignedIn, itemToNotification } from "$lib/util";
  import {
    isWideLayout,
    notificationNotUpdated,
    notificationPermission,
    sortBy,
    sortOrder,
    remoteNotifications,
  } from "$lib/store";
  import { sortItems } from "$lib/sortItems";
  import { unsubscribe } from "$lib/notification";

  export let data: PageData;
  $: showSignedInContent = isSignedIn(data);

  $: getItemDataQuery = createQuery({
    queryKey: [QUERY_KEYS.itemData],
    queryFn: getItemData,
    enabled: browser && showSignedInContent,
  });
  $: setNotificationDataMutation = createMutation({
    mutationFn: setNotificationData,
  });
  $: unsubscribeMutation = createMutation({
    mutationFn: unsubscribe,
  });

  const handleApply = async () => {
    const itemData = $getItemDataQuery.data;
    if (!itemData) throw new Error("No Items");
    const notifications: NotificationV1[] = itemData.items.map((item) => itemToNotification(item));
    const notificationData: NotificationDataV1 = {
      formatVersion: 1,
      enabled: true,
      notifications,
    };
    $remoteNotifications = notificationData.notifications;
    await $setNotificationDataMutation.mutateAsync(notificationData);
    $notificationNotUpdated = false;
  };

  let narrowLayoutTopAppBar: TopAppBar;
  let wideLayoutTopAppBar: TopAppBar;
  let moreMenu: Menu;
  let openUnsubscribeDialog = false;
  let updateItemDataSnackbar: Snackbar;
  let applyNotificationDataSnackbar: Snackbar;

  $: isMutatingSetItemData = useIsMutating([MUTATION_KEYS.itemData]);

  $: {
    if ($getItemDataQuery.isFetched) {
      const itemData = $getItemDataQuery.data;
      if (!itemData) throw new Error("No Items");
      const notifications = itemData.items.map((item) => itemToNotification(item));
      $notificationNotUpdated = !equal(notifications, $remoteNotifications);
    }
  }

  $: {
    if (updateItemDataSnackbar) {
      if ($isMutatingSetItemData) updateItemDataSnackbar.open();
      else updateItemDataSnackbar.close();
    }
  }

  $: {
    if (applyNotificationDataSnackbar) {
      if ($setNotificationDataMutation.isLoading) applyNotificationDataSnackbar.open();
      else applyNotificationDataSnackbar.close();
    }
  }
</script>

<svelte:head>
  <title>通知</title>
</svelte:head>

{#if !$isWideLayout}
  <BackHomeAppBar bind:topAppBar={narrowLayoutTopAppBar} title="通知">
    <Section align="end" toolbar>
      {#if $notificationPermission === "granted"}
        <IconButton class="material-icons" on:click={() => moreMenu.setOpen(true)}>more_vert</IconButton>
      {/if}
    </Section>
  </BackHomeAppBar>
{:else if $notificationPermission === "granted"}
  <TopAppBar bind:this={wideLayoutTopAppBar} variant="fixed" class="home-top-app-bar" style="width: calc(100% - 256px)">
    <Row>
      <Section align="start" toolbar>
        <Button
          variant="unelevated"
          disabled={!$notificationNotUpdated || $setNotificationDataMutation.isLoading}
          on:click={() => handleApply()}
        >
          <Icon class="material-icons">upload</Icon>
          <Label>通知設定を反映</Label>
        </Button>
      </Section>
      <Section align="end" toolbar>
        <IconButton class="material-icons" on:click={() => moreMenu.setOpen(true)}>more_vert</IconButton>
      </Section>
    </Row>
  </TopAppBar>
{/if}
<ResponsiveAutoAdjust {wideLayoutTopAppBar} {narrowLayoutTopAppBar}>
  {#if $notificationPermission === "granted"}
    {#if $getItemDataQuery.isFetching}
      <Loading />
    {/if}
    {#if $getItemDataQuery.data}
      <div class="stack">
        {#each sortItems($getItemDataQuery.data.items, $sortBy, $sortOrder) as item (item.id)}
          <NotificationCard {item} />
        {/each}
      </div>
      {#if !$isWideLayout}
        <div class="fav-container">
          <Fab
            aria-label="Upload"
            color="primary"
            exited={!$notificationNotUpdated || $setNotificationDataMutation.isLoading}
            on:click={() => handleApply()}
          >
            <Icon class="material-icons">upload</Icon>
          </Fab>
        </div>
      {/if}
    {/if}
    <Snackbar bind:this={updateItemDataSnackbar} timeoutMs={-1}>
      <SnackbarLabel>更新中……</SnackbarLabel>
    </Snackbar>
    <Snackbar bind:this={applyNotificationDataSnackbar} timeoutMs={-1}>
      <SnackbarLabel>反映中……</SnackbarLabel>
    </Snackbar>
  {:else if $notificationPermission === "denied"}
    <div>通知が拒否されています</div>
  {:else if $notificationPermission === "default"}
    <div class="welcome">
      <Subscribe />
    </div>
  {/if}
</ResponsiveAutoAdjust>

<Menu bind:this={moreMenu} anchorCorner="TOP_LEFT" style="left:unset; right:0">
  <List>
    <ListItem
      on:SMUI:action={() => {
        openUnsubscribeDialog = true;
      }}>通知購読を解除</ListItem
    >
  </List>
</Menu>

<Dialog bind:open={openUnsubscribeDialog}>
  <Title>通知購読を解除</Title>
  <Content>
    <p>通知購読を解除するとこの端末で支払日事前通知を受け取れなくなります。</p>
    <p>再度通知を有効化することで再び受け取ることができます。</p>
  </Content>
  <Actions>
    <Button>
      <Label>キャンセル</Label>
    </Button>
    <Button
      on:click={() => {
        $unsubscribeMutation.mutate();
      }}
    >
      <Label>解除</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  .welcome {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100vh;
    height: 100lvh;
  }
  .stack {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .fav-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
