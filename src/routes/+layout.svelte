<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { AppContent, Scrim } from "@smui/drawer";
  import { pwaInfo } from "virtual:pwa-info";
  import { onMount } from "svelte";
  import Drawer from "./_components/MenuDrawer.svelte";
  import { browser } from "$app/environment";
  import "normalize.css";
  import "@material/typography/mdc-typography.scss";
  import { env } from "$env/dynamic/public";
  import { theme } from "$lib/store";
  import { page } from "$app/stores";

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

  onMount(() => {
    const light = document.getElementById("smui-css-light");
    const dark = document.getElementById("smui-css-dark");
    theme.subscribe((val) => {
      if (val === "light") {
        light?.setAttribute("media", "all");
        dark?.setAttribute("media", "print");
      } else {
        dark?.setAttribute("media", "all");
        light?.setAttribute("media", "print");
      }
    });
  });
</script>

<svelte:head>
  <link rel="icon" href={env.PUBLIC_ICON_PATH} />
  <link rel="apple-touch-icon" sizes="512x512" href={env.PUBLIC_ICON_PATH} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html webManifestLink}
</svelte:head>

<QueryClientProvider client={queryClient}>
  <div class="app">
    <Drawer currentRoute={$page.route.id ?? ""} />
    <Scrim />
    <AppContent class="app-content">
      <slot />
    </AppContent>
  </div>
</QueryClientProvider>
