<script lang="ts">
  import Drawer, { Content, Header, Subtitle, Title } from "@smui/drawer";
  import List, { Graphic, Item, Separator, Text } from "@smui/list";
  import { signOut } from "svelte-google-auth/client";
  import { openMenuDrawer } from "$lib/store";
  import { APP_DESCRIPTION, APP_NAME } from "$lib/const";

  const Routes = [
    {
      href: "/",
      icon: "home",
      label: "ホーム",
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
  ] as const satisfies ReadonlyArray<{
    href: string;
    icon: string;
    label: string;
  }>;

  export let currentRoute: string;
  export let isWideLayout = false;

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
      {#each Routes as { href, icon, label } (href)}
        <Item {href} on:click={() => onClose()} activated={href === currentRoute}>
          <Graphic class="material-icons" aria-hidden="true">{icon}</Graphic>
          <Text>{label}</Text>
        </Item>
      {/each}
    </List>
    <Separator />
    <List>
      <Item
        on:SMUI:action={() => {
          signOut();
          onClose();
        }}
      >
        <Graphic class="material-icons" aria-hidden="true">logout</Graphic>
        <Text>サインアウト</Text>
      </Item>
    </List>
  </Content>
</Drawer>
