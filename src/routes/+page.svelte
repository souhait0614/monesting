<script lang="ts">
  import { initialize } from "svelte-google-auth/client";
  import SmuiBottomAppBar, { AutoAdjust } from "@smui-extra/bottom-app-bar";
  import { createQuery } from "@tanstack/svelte-query";
  import type { PageData } from "./$types";
  import BottomAppBar from "./BottomAppBar.svelte";
  import Welcome from "./Welcome.svelte";
  import { invalidateAll } from "$app/navigation";
  import { QUERY_KEYS } from "$lib/const";

  export let data: PageData;
  $: user = data.auth.user;
  $: isSingedIn = user !== undefined;
  initialize(data, invalidateAll);

  let bottomAppBar: SmuiBottomAppBar;

  const query = createQuery({
    queryKey: [QUERY_KEYS.items],
  });
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

{#if isSingedIn}
  <AutoAdjust {bottomAppBar}>
    <div class="test" />
  </AutoAdjust>
{:else}
  <main class="welcome">
    <Welcome />
  </main>
{/if}

{#if isSingedIn}
  <BottomAppBar {bottomAppBar} />
{/if}

<style lang="scss">
  .welcome {
    width: 100%;
    height: 100vh;
    height: 100lvh;
  }
  .test {
    height: 200vh;
  }
</style>
