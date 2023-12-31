<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { AppContent, Scrim } from "@smui/drawer";
  import { pwaInfo } from "virtual:pwa-info";
  import { onMount } from "svelte";
  import { match } from "ts-pattern";
  import Drawer from "./_components/MenuDrawer.svelte";
  import type { LayoutData } from "./$types";
  import { browser } from "$app/environment";
  import "normalize.css";
  import "@material/typography/mdc-typography.scss";
  import { env } from "$env/dynamic/public";
  import { isWideLayout, notificationPermission, remoteNotifications, theme } from "$lib/store";
  import { page } from "$app/stores";
  import { isSignedIn } from "$lib/util";
  import { getIsSubscribeNotification } from "$lib/notification";
  import { getNotificationData } from "$lib/fetch";

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

  export let data: LayoutData;
  $: showSignedInContent = isSignedIn(data);
  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

  let innerWidth: number;
  $: isWideLayout.set(innerWidth >= 900);

  onMount(async () => {
    // Theme
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

    // Notification
    $notificationPermission = await match(Notification.permission)
      .with("granted", async () => {
        const res = await getIsSubscribeNotification();
        return res ? "granted" : "default";
      })
      .otherwise(() => Promise.resolve(Notification.permission));

    $remoteNotifications = (await getNotificationData()).notifications ?? [];
  });
</script>

<svelte:head>
  <link rel="icon" href={env.PUBLIC_ICON_PATH} />
  <link rel="apple-touch-icon" sizes="512x512" href={env.PUBLIC_ICON_PATH} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html webManifestLink}
</svelte:head>

<svelte:window bind:innerWidth />

<QueryClientProvider client={queryClient}>
  <div class="app">
    <Drawer currentRoute={$page.route.id ?? ""} isWideLayout={$isWideLayout} {showSignedInContent} />
    <Scrim />
    <AppContent class="app-content">
      <slot />
    </AppContent>
  </div>
</QueryClientProvider>

<style lang="scss">
  .app {
    display: flex;
    grid-template-columns: auto 1fr;
    position: relative;
  }
  :global(.app-content) {
    width: 100%;
  }
</style>
