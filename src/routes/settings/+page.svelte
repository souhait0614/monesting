<script lang="ts">
  import List, { Graphic, Group, Item, PrimaryText, SecondaryText, Subheader, Text } from "@smui/list";
  import SmuiTopAppBar, { AutoAdjust } from "@smui/top-app-bar";

  import Menu from "@smui/menu";
  import TopAppBar from "../_components/BackHomeAppBar.svelte";
  import { theme, defaultCurrency } from "../../lib/store";
  import { THEMES } from "$lib/const";
  import { CURRENCY_CODES } from "$lib/currencyCodes";

  let topAppBar: SmuiTopAppBar;

  let themeMenu: Menu;
  let defaultCurrencyMenu: Menu;

  const themeNames = {
    system: "システムに追従",
    light: "ライト",
    dark: "ダーク",
  } as const satisfies Record<THEMES, string>;
</script>

<svelte:head>
  <title>設定</title>
</svelte:head>

<TopAppBar bind:topAppBar title="設定" />
<AutoAdjust {topAppBar}>
  <Group>
    <Subheader>一般</Subheader>
    <List twoLine>
      <Item
        on:SMUI:action={() => {
          themeMenu.setOpen(true);
        }}
      >
        <Graphic class="material-icons" aria-hidden="true">brightness_6</Graphic>
        <Text>
          <PrimaryText>テーマ</PrimaryText>
          <SecondaryText>{themeNames[$theme]}</SecondaryText>
        </Text>
      </Item>
      <Item
        on:SMUI:action={() => {
          defaultCurrencyMenu.setOpen(true);
        }}
      >
        <Graphic class="material-icons" aria-hidden="true">attach_money</Graphic>
        <Text>
          <PrimaryText>デフォルト通貨</PrimaryText>
          <SecondaryText>{$defaultCurrency}</SecondaryText>
        </Text>
      </Item>
    </List>
  </Group>
</AutoAdjust>

<Menu bind:this={themeMenu} anchorCorner="BOTTOM_LEFT">
  <List>
    {#each Object.values(THEMES) as id (id)}
      <Item
        on:SMUI:action={() => {
          $theme = id;
        }}
      >
        <Text>{themeNames[id] ?? id}</Text>
      </Item>
    {/each}
  </List>
</Menu>

<Menu bind:this={defaultCurrencyMenu} anchorCorner="BOTTOM_LEFT">
  <List>
    {#each CURRENCY_CODES as code (code)}
      <Item
        on:SMUI:action={() => {
          $defaultCurrency = code;
        }}
      >
        <Text>{code}</Text>
      </Item>
    {/each}
  </List>
</Menu>
