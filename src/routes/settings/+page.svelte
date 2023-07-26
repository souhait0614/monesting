<script lang="ts">
  import List, { Graphic, Item, PrimaryText, SecondaryText, Text } from "@smui/list";
  import SmuiTopAppBar, { AutoAdjust } from "@smui/top-app-bar";

  import Menu from "@smui/menu";
  import TopAppBar from "../_components/BackHomeAppBar.svelte";
  import { theme } from "../../lib/store";
  import { THEMES } from "$lib/const";

  let topAppBar: SmuiTopAppBar;

  let themeMenu: Menu;

  const themeNames = {
    system: "システムに追従",
    light: "ライト",
    dark: "ダーク",
  } as const satisfies Record<THEMES, string>;
</script>

<svelte:head>
  <title>設定</title>
</svelte:head>

<TopAppBar {topAppBar} />
<AutoAdjust {topAppBar} class="mdc-top-app-bar--fixed-adjust">
  <div>
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
    </List>
    <Menu bind:this={themeMenu}>
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
  </div>
</AutoAdjust>
