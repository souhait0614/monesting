<script lang="ts">
  import Drawer, { Content, Header, Subtitle, Title } from "@smui/drawer";
  import List, { Graphic, Item, Separator, Text } from "@smui/list";
  import { signOut } from "svelte-google-auth/client";
  import Badge from "@smui-extra/badge";
  import { notificationNotUpdated, openMenuDrawer } from "$lib/store";
  import { APP_DESCRIPTION, APP_NAME } from "$lib/const";
  import { enableNotification } from "$lib/env";
  import { goto } from "$app/navigation";

  export let currentRoute: string;
  export let isWideLayout = false;
  export let showSignedInContent = false;

  type Route = {
    href: string;
    icon: string;
    label: string;
    hide?: boolean;
    showBudgie?: boolean;
  };
  let routes: Route[];
  $: routes = [
    {
      href: "/",
      icon: "home",
      label: "ホーム",
    },
    {
      href: "/notification",
      icon: "notifications",
      label: "通知",
      hide: !showSignedInContent || !enableNotification,
      showBudgie: $notificationNotUpdated,
    },
    {
      href: "/settings",
      icon: "settings",
      label: "設定",
    },
    {
      href: "/about",
      icon: "help",
      label: `${APP_NAME}について`,
    },
  ];

  const onClose = () => {
    $openMenuDrawer = false;
  };
</script>

<Drawer
  variant={isWideLayout ? undefined : "modal"}
  bind:open={$openMenuDrawer}
  style={isWideLayout ? "height: 100vh; position:sticky; left:0; top: 0;" : undefined}
>
  <Header>
    <Title>{APP_NAME}</Title>
    <Subtitle>{APP_DESCRIPTION}</Subtitle>
  </Header>
  <Content>
    <List>
      {#each routes as { href, icon, label, hide, showBudgie } (href)}
        {#if !hide}
          <Item {href} on:click={() => onClose()} activated={href === currentRoute}>
            <Graphic class="material-icons" aria-hidden="true">{icon}</Graphic>
            <Text>{label}</Text>
            {#if showBudgie}
              <Badge position="inset" style="min-height: 12px; min-width: 12px; padding: 0;" />
            {/if}
          </Item>
        {/if}
      {/each}
    </List>
    {#if showSignedInContent}
      <Separator />
      <List>
        <Item
          on:SMUI:action={() => {
            signOut();
            onClose();
            goto("/");
          }}
        >
          <Graphic class="material-icons" aria-hidden="true">logout</Graphic>
          <Text>サインアウト</Text>
        </Item>
      </List>
    {/if}
  </Content>
</Drawer>
