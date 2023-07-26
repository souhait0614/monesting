<script lang="ts">
  import SmuiTopAppBar, { AutoAdjust } from "@smui/top-app-bar";
  import List, { Item, Graphic, Text, PrimaryText, SecondaryText, Group, Subheader } from "@smui/list";
  import Github from "@inqling/svelte-icons/simple-icons/github.svelte";
  import TopAppBar from "../_components/BackHomeAppBar.svelte";
  import { APP_NAME } from "$lib/const";
  import { version } from "$app/environment";

  let topAppBar: SmuiTopAppBar;
</script>

<svelte:head>
  <title>{APP_NAME}について</title>
</svelte:head>

<TopAppBar bind:topAppBar title={`${APP_NAME}について`} />
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
  </Group>
</AutoAdjust>
