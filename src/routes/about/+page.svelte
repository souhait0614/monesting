<script lang="ts">
  import SmuiTopAppBar, { AutoAdjust } from "@smui/top-app-bar";
  import List, { Item, Graphic, Text, PrimaryText, SecondaryText, Group, Subheader } from "@smui/list";
  import Github from "@inqling/svelte-icons/simple-icons/github.svelte";
  import Misskey from "@inqling/svelte-icons/simple-icons/misskey.svelte";
  import TopAppBar from "../_components/BackHomeAppBar.svelte";
  import { APP_NAME } from "$lib/const";
  import { version } from "$app/environment";
  import { isWideLayout } from "$lib/store";

  let topAppBar: SmuiTopAppBar;
</script>

<svelte:head>
  <title>{APP_NAME}について</title>
</svelte:head>

{#if !$isWideLayout}
  <TopAppBar bind:topAppBar title={`${APP_NAME}について`} />
{/if}
<AutoAdjust {topAppBar}>
  <Group>
    <Subheader>{APP_NAME}</Subheader>
    <List twoLine>
      <Item>
        <Graphic class="material-icons" aria-hidden="true">info</Graphic>
        <Text>
          <PrimaryText>アプリバージョン</PrimaryText>
          <SecondaryText>{version}</SecondaryText>
        </Text>
      </Item>
      <Item tag="a" href="https://github.com/souhait0614/monesting" target="_blank">
        <Graphic aria-hidden="true">
          <Github />
        </Graphic>
        <Text>
          <PrimaryText>Github</PrimaryText>
          <SecondaryText>https://github.com/souhait0614/monesting</SecondaryText>
        </Text>
      </Item>
    </List>
    <Subheader>開発者のリンク</Subheader>
    <List twoLine>
      <Item tag="a" href="https://souhait.me" target="_blank">
        <Graphic class="material-icons" aria-hidden="true">home</Graphic>
        <Text>
          <PrimaryText>ホームページ</PrimaryText>
          <SecondaryText>https://souhait.me</SecondaryText>
        </Text>
      </Item>
      <Item tag="a" href="https://submarin.online/@souhait" target="_blank">
        <Graphic aria-hidden="true">
          <Misskey />
        </Graphic>
        <Text>
          <PrimaryText>Misskey</PrimaryText>
          <SecondaryText>https://submarin.online/@souhait</SecondaryText>
        </Text>
      </Item>
      <Item tag="a" href="https://github.com/souhait0614" target="_blank">
        <Graphic aria-hidden="true">
          <Github />
        </Graphic>
        <Text>
          <PrimaryText>Github</PrimaryText>
          <SecondaryText>https://github.com/souhait0614</SecondaryText>
        </Text>
      </Item>
      <Item tag="a" href="https://x.com/ElectronicsBot" target="_blank">
        <Graphic aria-hidden="true"><span style="font-size:30px;">𝕏</span></Graphic>
        <Text>
          <PrimaryText>X</PrimaryText>
          <SecondaryText>https://x.com/ElectronicsBot</SecondaryText>
        </Text>
      </Item>
    </List>
  </Group>
</AutoAdjust>
