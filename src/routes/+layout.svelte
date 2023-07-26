<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { AppContent, Scrim } from "@smui/drawer";
  import Drawer from "./_components/MenuDrawer.svelte";
  import { theme } from "$lib/store";
  import { browser } from "$app/environment";
  import "normalize.css";
  import "@material/typography/mdc-typography.scss";

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
</script>

<svelte:head>
  {#if $theme === "light"}
    <link rel="stylesheet" href="/smui.css" />
  {:else if $theme === "dark"}
    <link rel="stylesheet" href="/smui-dark.css" />
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
