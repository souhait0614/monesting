<script lang="ts">
  import List, { Graphic, Group, Item, PrimaryText, SecondaryText, Subheader, Text } from "@smui/list";
  import SmuiTopAppBar, { AutoAdjust } from "@smui/top-app-bar";

  import Dialog, { Actions, Content, InitialFocus, Title } from "@smui/dialog";
  import Button from "@smui/button";
  import Autocomplete from "@smui-extra/autocomplete";
  import Radio from "@smui/radio";
  import { createMutation } from "@tanstack/svelte-query";
  import { format } from "date-fns";
  import Snackbar, { Label } from "@smui/snackbar";
  import TopAppBar from "../_components/BackHomeAppBar.svelte";
  import { theme, defaultCurrency } from "../../lib/store";
  import { THEMES } from "$lib/const";
  import { CURRENCY_CODES } from "$lib/currencyCodes";
  import { getItemData } from "$lib/fetch";

  let topAppBar: SmuiTopAppBar;
  let exportingSnackbar: Snackbar;

  let openThemeDialog = false;
  let openDefaultCurrencyDialog = false;

  let defaultCurrencyValue: CURRENCY_CODES | undefined;

  const themeNames = {
    // system: "システムに追従",
    light: "ライト",
    dark: "ダーク",
  } as const satisfies Record<THEMES, string>;

  $: exportMutation = createMutation({
    mutationFn: async () => {
      const itemData = await getItemData();
      const blob = new Blob([JSON.stringify(itemData)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `monesting_export_${format(new Date(), "yyyy-MM-dd_HH:mm:ss")}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
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
          openThemeDialog = true;
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
          defaultCurrencyValue = $defaultCurrency;
          openDefaultCurrencyDialog = true;
        }}
      >
        <Graphic class="material-icons" aria-hidden="true">attach_money</Graphic>
        <Text>
          <PrimaryText>デフォルト通貨</PrimaryText>
          <SecondaryText>{$defaultCurrency}</SecondaryText>
        </Text>
      </Item>
    </List>
    <Subheader>高度な機能</Subheader>
    <List twoLine>
      <Item
        on:SMUI:action={async () => {
          exportingSnackbar.open();
          await $exportMutation.mutateAsync();
          exportingSnackbar.close();
        }}
        disabled={$exportMutation.isLoading}
      >
        <Graphic class="material-icons" aria-hidden="true">file_download</Graphic>
        <Text>
          <PrimaryText>データをエクスポート</PrimaryText>
          <SecondaryText>サブスクリプションのデータをjsonファイルに書き出します</SecondaryText>
        </Text>
      </Item>
      <!-- <Item>
        <Graphic class="material-icons" aria-hidden="true">file_upload</Graphic>
        <Text>
          <PrimaryText>データをインポート</PrimaryText>
          <SecondaryText>エクスポートされたjsonファイルからサブスクリプションのデータを復元します</SecondaryText>
        </Text>
      </Item> -->
    </List>
  </Group>
  <Snackbar bind:this={exportingSnackbar} timeoutMs={-1}>
    <Label>エクスポート中……</Label>
  </Snackbar>
</AutoAdjust>

<Dialog bind:open={openThemeDialog} selection>
  <Title>テーマ</Title>
  <Content>
    <List radioList>
      {#each Object.values(THEMES) as id (id)}
        <Item use={[$theme === id ? InitialFocus : () => {}]}>
          <Graphic>
            <Radio bind:group={$theme} value={id} />
          </Graphic>
          <Text>{themeNames[id]}</Text>
        </Item>
      {/each}
    </List>
  </Content>
  <Actions>
    <Button>閉じる</Button>
  </Actions>
</Dialog>

<Dialog bind:open={openDefaultCurrencyDialog} style="overflow-y:visible">
  <Title>デフォルト通貨</Title>
  <Content style="overflow-y:visible">
    <Autocomplete
      style="width: 100%;"
      textfield$style="width: 100%;"
      textfield$helperLine$style="width: 100%;"
      options={[...CURRENCY_CODES]}
      textfield$variant="outlined"
      textfield$required
      bind:value={defaultCurrencyValue}
    />
  </Content>
  <Actions>
    <Button>キャンセル</Button>
    <Button
      disabled={!defaultCurrencyValue}
      on:click={() => {
        if (!defaultCurrencyValue) return;
        $defaultCurrency = defaultCurrencyValue;
      }}>反映</Button
    >
  </Actions>
</Dialog>
