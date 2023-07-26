<script lang="ts">
  import Drawer, { Content, Header, Subtitle, Title } from "@smui/drawer";
  import List, { Graphic, Item, Separator, Text } from "@smui/list";
  import { signOut } from "svelte-google-auth/client";
  import { openMenuDrawer } from "$lib/store";
  import { APP_DESCRIPTION, APP_NAME } from "$lib/const";

  const onClose = () => {
    $openMenuDrawer = false;
  };
</script>

<Drawer variant="modal" bind:open={$openMenuDrawer}>
  <Header>
    <Title>{APP_NAME}</Title>
    <Subtitle>{APP_DESCRIPTION}</Subtitle>
  </Header>
  <Content>
    <List>
      <Item href="/settings" on:click={() => onClose()}>
        <Graphic class="material-icons" aria-hidden="true">settings</Graphic>
        <Text>設定</Text>
      </Item>
      <Item href="/about" on:click={() => onClose()}>
        <Graphic class="material-icons" aria-hidden="true">help</Graphic>
        <Text>{APP_NAME}について</Text>
      </Item>
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
