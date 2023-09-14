<script lang="ts">
  import { initialize } from "svelte-google-auth/client";
  import { createQuery, useIsMutating } from "@tanstack/svelte-query";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import Snackbar, { Label as SnackbarLabel } from "@smui/snackbar";
  import equal from "fast-deep-equal";
  import type { PageData } from "./$types";
  import Welcome from "./Welcome.svelte";
  import ItemCard from "./_components/ItemCard.svelte";
  import EditItemModal from "./_components/EditItemModal.svelte";
  import HomeAppBarContainer from "./_components/HomeAppBarContainer.svelte";
  import Loading from "./_components/Loading.svelte";
  import { invalidateAll } from "$app/navigation";
  import { APP_DESCRIPTION, APP_NAME, MUTATION_KEYS, QUERY_KEYS } from "$lib/const";
  import { getItemData } from "$lib/fetch";
  import { browser } from "$app/environment";
  import { sortItems } from "$lib/sortItems";
  import {
    isWideLayout,
    notificationNotUpdated,
    openAddItemModal,
    remoteNotifications,
    sortBy,
    sortOrder,
  } from "$lib/store";
  import { isSignedIn, itemToNotification } from "$lib/util";

  export let data: PageData;
  $: showSignedInContent = isSignedIn(data);
  initialize(data, invalidateAll);

  let snackbar: Snackbar;

  $: getItemDataQuery = createQuery({
    queryKey: [QUERY_KEYS.itemData],
    queryFn: getItemData,
    enabled: browser && showSignedInContent,
  });

  $: isMutatingSetItemData = useIsMutating([MUTATION_KEYS.itemData]);

  $: items = $getItemDataQuery.data?.items ?? [];

  $: {
    if (snackbar) {
      if ($isMutatingSetItemData) snackbar.open();
      else snackbar.close();
    }
  }

  $: {
    if ($getItemDataQuery.isFetched) {
      const notifications = items.map((item) => itemToNotification(item));
      $notificationNotUpdated = !equal(notifications, $remoteNotifications);
    }
  }
</script>

<svelte:head>
  <title>{APP_NAME}</title>
  <meta name="description" content={APP_DESCRIPTION} />
</svelte:head>

<HomeAppBarContainer exitedFab={$getItemDataQuery.isLoading} {showSignedInContent}>
  {#if showSignedInContent}
    {#if $getItemDataQuery.isFetching}
      <Loading />
    {/if}
    {#if !$getItemDataQuery.isFetching && $getItemDataQuery.isSuccess}
      <div class="stack">
        {#if !$isWideLayout}
          <h1>
            {APP_NAME}
          </h1>
        {/if}
        {#each sortItems(items, $sortBy, $sortOrder) as item (item.id)}
          <ItemCard {item} />
        {/each}
      </div>
    {/if}
    {#if $getItemDataQuery.isError}
      <Dialog open scrimClickAction="" escapeKeyAction="" aria-labelledby="error" aria-describedby="error-message">
        <Title id="error">エラーが発生しました</Title>
        <Content id="error-message">
          <p>リロードしても解決しない場合、Cookieを削除してください。</p>
          <p>{String($getItemDataQuery.error)}</p>
        </Content>
        <Actions>
          <Button
            on:click={() => {
              location.reload();
            }}
          >
            <Label>リロード</Label>
          </Button>
        </Actions>
      </Dialog>
    {/if}
    <Snackbar bind:this={snackbar} timeoutMs={-1}>
      <SnackbarLabel>更新中……</SnackbarLabel>
    </Snackbar>
  {:else}
    <div class="welcome">
      <Welcome />
    </div>
  {/if}
</HomeAppBarContainer>

{#if $openAddItemModal}
  <EditItemModal bind:open={$openAddItemModal} mode="add" />
{/if}

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
</style>
