<script lang="ts">
  import { initialize } from "svelte-google-auth/client";
  import SmuiBottomAppBar, { AutoAdjust } from "@smui-extra/bottom-app-bar";
  import { createQuery } from "@tanstack/svelte-query";
  import CircularProgress from "@smui/circular-progress";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import type { PageData } from "./$types";
  import BottomAppBar from "./_components/BottomAppBar.svelte";
  import Welcome from "./Welcome.svelte";
  import ItemCard from "./_components/ItemCard.svelte";
  import { invalidateAll } from "$app/navigation";
  import { APP_DESCRIPTION, APP_NAME, QUERY_KEYS } from "$lib/const";
  import { getItems } from "$lib/fetch";
  import { browser } from "$app/environment";
  import { sortItems } from "$lib/sortItems";
  import { sortBy, sortOrder } from "$lib/store";

  export let data: PageData;
  $: user = data.auth.user;
  $: isSingedIn = user !== undefined;
  initialize(data, invalidateAll);

  let bottomAppBar: SmuiBottomAppBar;

  $: query = createQuery({
    queryKey: [QUERY_KEYS.items],
    queryFn: getItems,
    enabled: browser && isSingedIn,
  });

  $: items = $query.data?.items ?? [];
</script>

<svelte:head>
  <title>{APP_NAME}</title>
  <meta name="description" content={APP_DESCRIPTION} />
</svelte:head>

{#if isSingedIn}
  <AutoAdjust {bottomAppBar} class="smui-bottom-app-bar--fixed-adjust">
    {#if $query.isFetching}
      <div class="loading">
        <CircularProgress style="height: 40px; width: 40px;" indeterminate />
      </div>
    {/if}
    {#if !$query.isFetching && $query.isSuccess}
      <div class="stack">
        <h1>
          {APP_NAME}
        </h1>
        {#each sortItems(items, $sortBy, $sortOrder) as item (item.id)}
          <ItemCard {item} />
        {/each}
        <!-- <ItemCard
          item={{
            id: crypto.randomUUID(),
            label: "souhait.me",
            from: "Cloudflare Registrar",
            price: 12.85,
            currency: "USD",
            start: new Date("1989/6/16"),
            frequency: {
              year: 1,
              month: 0,
              day: 0,
            },
          }}
        /> -->
      </div>
    {/if}
    {#if $query.isError}
      <Dialog open scrimClickAction="" escapeKeyAction="" aria-labelledby="error" aria-describedby="error-message">
        <Title id="error">エラーが発生しました</Title>
        <Content id="error-message">
          <p>リロードしても解決しない場合、Cookieを削除してください。</p>
          <p>{String($query.error)}</p>
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
  </AutoAdjust>
  <BottomAppBar {bottomAppBar} exitedFab={$query.isLoading} />
{:else}
  <main class="welcome">
    <Welcome />
  </main>
{/if}

<style lang="scss">
  .welcome {
    width: 100%;
    height: 100vh;
    height: 100lvh;
  }
  .loading {
    width: 100%;
    height: 100vh;
    height: 100lvh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .stack {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
