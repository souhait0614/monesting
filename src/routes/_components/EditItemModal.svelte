<script lang="ts">
  import Button, { Label } from "@smui/button";
  import Dialog, { Actions, Content, Header, InitialFocus, Title } from "@smui/dialog";
  import TextField from "@smui/textfield";
  import Autocomplete from "@smui-extra/autocomplete";
  import { format } from "date-fns";
  import { createMutation, useIsMutating, useQueryClient } from "@tanstack/svelte-query";
  import IconButton from "@smui/icon-button";
  import Menu from "@smui/menu";
  import List, { Item as ListItem } from "@smui/list";
  import { match } from "ts-pattern";
  import { isItemDataV2 } from "../../types/ItemData";
  import { type ItemV2, isItemV2 } from "../../types/ItemV2";
  import { CURRENCY_CODES } from "$lib/currencyCodes";
  import { MUTATION_KEYS, QUERY_KEYS } from "$lib/const";
  import { addItem, updateItem, removeItem } from "$lib/item";
  import { setItemData } from "$lib/fetch";
  import { defaultCurrency } from "$lib/store";

  export let open = false;
  export let mode: "add" | "update";

  export let defaultValue: ItemV2 | undefined = undefined;

  const text = {
    title: {
      add: "アイテム追加",
      update: "アイテム更新",
    },
    applyButtonLabel: {
      add: "追加",
      update: "更新",
    },
  } as const satisfies Record<string, Record<typeof mode, string>>;

  let labelValue: string | null = defaultValue?.label ?? null;
  let fromValue: string | null = defaultValue?.from ?? null;
  let priceValue: number | null = defaultValue?.price ?? null;
  let currencyValue: string | null = defaultValue?.currency ?? $defaultCurrency;
  let startValue: string | null = format(defaultValue?.start ? new Date(defaultValue.start) : new Date(), "yyyy-MM-dd");
  let frequencyYearValue: number | null = defaultValue?.frequency.year ?? 0;
  let frequencyMonthValue: number | null = defaultValue?.frequency.month ?? 0;
  let frequencyDayValue: number | null = defaultValue?.frequency.day ?? 0;
  let noteValue: string | null = defaultValue?.note ?? null;

  $: tempItem = {
    id: defaultValue?.id ?? "",
    label: labelValue ?? "",
    from: fromValue ?? "",
    price: priceValue ?? 0,
    currency: currencyValue ?? "",
    start: startValue ?? "",
    frequency: {
      year: frequencyYearValue ?? 0,
      month: frequencyMonthValue ?? 0,
      day: frequencyDayValue ?? 0,
    },
    note: noteValue ?? "",
  } satisfies ItemV2;

  $: disableApplyButton =
    labelValue === null ||
    fromValue === null ||
    priceValue === null ||
    currencyValue === null ||
    startValue === null ||
    frequencyYearValue === null ||
    frequencyMonthValue === null ||
    frequencyDayValue === null ||
    Number.isNaN(new Date(startValue).getTime()) ||
    frequencyYearValue + frequencyMonthValue + frequencyDayValue <= 0;

  $: setItemDataMutation = createMutation({
    mutationFn: setItemData,
    mutationKey: [MUTATION_KEYS.itemData],
  });

  $: isMutatingSetItemData = useIsMutating([MUTATION_KEYS.itemData]);

  $: queryClient = useQueryClient();

  let moreMenu: Menu;
  let openDeleteDialog = false;
</script>

<Dialog bind:open escapeKeyAction="" scrimClickAction="" surface$style="width: 400px; max-width: calc(100vw - 32px);">
  <Header style="display:flex; justify-content:space-between; align-items:end">
    <Title>{text.title[mode]}</Title>
    {#if mode === "update"}
      <IconButton class="material-icons" on:click={() => moreMenu.setOpen(true)}>more_vert</IconButton>
      <Menu bind:this={moreMenu} anchorCorner="TOP_LEFT" style="left:unset; right:0">
        <List>
          <ListItem
            on:SMUI:action={() => {
              openDeleteDialog = true;
            }}>削除</ListItem
          >
        </List>
      </Menu>
    {/if}
  </Header>
  <Content>
    <div class="container">
      <TextField
        style="width: 100%;"
        helperLine$style="width: 100%;"
        variant="outlined"
        label="名前"
        required
        bind:value={labelValue}
        updateInvalid
        input$use={[InitialFocus]}
      />
      <TextField
        style="width: 100%;"
        helperLine$style="width: 100%;"
        variant="outlined"
        label="請求者"
        required
        bind:value={fromValue}
      />
      <div class="price-currency">
        <TextField
          style="width: 100%;"
          helperLine$style="width: 100%;"
          variant="outlined"
          type="number"
          input$step="0.01"
          label="請求額"
          required
          bind:value={priceValue}
        />
        <Autocomplete
          options={[...CURRENCY_CODES]}
          textfield$variant="outlined"
          label="通貨"
          textfield$required
          bind:value={currencyValue}
        />
      </div>
      <TextField
        style="width: 100%;"
        helperLine$style="width: 100%;"
        variant="outlined"
        type="date"
        label="開始日"
        required
        bind:value={startValue}
      />
      <span>請求間隔</span>
      <div class="frequency">
        <TextField
          style="width: 100%;"
          helperLine$style="width: 100%;"
          variant="outlined"
          type="number"
          input$min={0}
          label="年"
          required
          bind:value={frequencyYearValue}
        />
        <TextField
          style="width: 100%;"
          helperLine$style="width: 100%;"
          variant="outlined"
          type="number"
          input$min={0}
          label="月"
          required
          bind:value={frequencyMonthValue}
        />
        <TextField
          style="width: 100%;"
          helperLine$style="width: 100%;"
          variant="outlined"
          type="number"
          input$min={0}
          label="日"
          required
          bind:value={frequencyDayValue}
        />
      </div>
      <TextField textarea bind:value={noteValue} label="ノート" />
    </div>
  </Content>
  <Actions>
    <Button>
      <Label>キャンセル</Label>
    </Button>
    <Button
      on:click={async () => {
        const itemData = queryClient.getQueryData([QUERY_KEYS.itemData]);
        if (!isItemV2(tempItem) || !isItemDataV2(itemData)) throw new Error("えらー");
        const newItemData = match(mode)
          .with("add", () => addItem(tempItem, itemData))
          .with("update", () => updateItem(tempItem, itemData))
          .exhaustive();
        queryClient.setQueryData([QUERY_KEYS.itemData], newItemData);
        $setItemDataMutation.mutate(newItemData);
      }}
      action="apply"
      disabled={disableApplyButton || Boolean($isMutatingSetItemData)}
    >
      <Label>{text.applyButtonLabel[mode]}</Label>
    </Button>
  </Actions>
</Dialog>

<Dialog bind:open={openDeleteDialog}>
  <Title>{defaultValue?.label}を削除しますか？</Title>
  <Content>
    <p>削除すると元に戻すことはできません。</p>
  </Content>
  <Actions>
    <Button>
      <Label>キャンセル</Label>
    </Button>
    <Button
      on:click={async () => {
        open = false;
        const itemData = queryClient.getQueryData([QUERY_KEYS.itemData]);
        if (!tempItem.id || !isItemDataV2(itemData)) throw new Error("えらー");
        const newItemData = removeItem(tempItem.id, itemData);
        queryClient.setQueryData([QUERY_KEYS.itemData], newItemData);
        $setItemDataMutation.mutate(newItemData);
      }}
      disabled={Boolean($isMutatingSetItemData)}
    >
      <Label>削除</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  .container {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .price-currency {
    display: grid;
    grid-template-columns: 1fr 5rem;
    gap: 1rem;
  }
  .frequency {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }
</style>
