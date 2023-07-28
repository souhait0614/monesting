<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { AppContent, Scrim } from "@smui/drawer";
  import { pwaInfo } from "virtual:pwa-info";
  import Drawer from "./_components/MenuDrawer.svelte";
  import { theme } from "$lib/store";
  import { browser } from "$app/environment";
  import "normalize.css";
  import "@material/typography/mdc-typography.scss";
  import { env } from "$env/dynamic/public";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<svelte:head>
  <link rel="icon" href={env.PUBLIC_ICON_PATH} />
  <link rel="apple-touch-icon" sizes="512x512" href={env.PUBLIC_ICON_PATH} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html webManifestLink}
  {#if $theme === "light"}
    <link rel="stylesheet" href="/smui.css" />
  {:else if $theme === "dark"}
    <link rel="stylesheet" href="/smui-dark.css" />
  {:else if $theme === "system"}
    <link rel="stylesheet" href="/smui.css" media="(prefers-color-scheme: light)" />
    <link rel="stylesheet" href="/smui-dark.css" media="screen and (prefers-color-scheme: dark)" />
  {/if}
</svelte:head>

<QueryClientProvider client={queryClient}>
  <div class="app">
    <Drawer />
    <Scrim />
    <AppContent class="app-content">
      <slot />
    </AppContent>
  </div>
</QueryClientProvider>
