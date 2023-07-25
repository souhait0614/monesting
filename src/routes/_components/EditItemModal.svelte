<script lang="ts">
  import Button, { Label } from "@smui/button";
  import Dialog, { Actions, Content, InitialFocus, Title } from "@smui/dialog";
  import TextField from "@smui/textfield";
  import Autocomplete from "@smui-extra/autocomplete";
  import { format } from "date-fns";
  import { useQueryClient } from "@tanstack/svelte-query";
  import { isItem, isItemData, type Item, type ItemData } from "../../types/ItemData";
  import { currencyCodes } from "$lib/currencyCodes";
  import { setItems } from "$lib/fetch";
  import { QUERY_KEYS } from "$lib/const";

  export let open = false;
  export let mode: "add" | "update";

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

  const addItem = async (item: Omit<Item, "id">, itemData: ItemData) => {
    let uuid = crypto.randomUUID();
    while (itemData.items.find(({ id }) => id === uuid)) {
      uuid = crypto.randomUUID();
    }
    const newItems: Item[] = [
      ...itemData.items,
      {
        id: uuid,
        ...item,
      },
    ];
    const newItemData: ItemData = {
      formatVersion: 1,
      items: newItems,
    };
    await setItems(newItemData);
  };

  let labelValue: string | null = null;
  let fromValue: string | null = null;
  let priceValue: number | null = null;
  let currencyValue: string | null = null;
  let startValue: string | null = format(new Date(), "yyyy-MM-dd");
  let frequencyYearValue: number | null = 0;
  let frequencyMonthValue: number | null = 0;
  let frequencyDayValue: number | null = 0;

  $: tempItem = {
    label: labelValue ?? "",
    from: fromValue ?? "",
    price: priceValue ?? 0,
    currency: currencyValue ?? "",
    start: new Date(startValue ?? ""),
    frequency: {
      year: frequencyYearValue ?? 0,
      month: frequencyMonthValue ?? 0,
      day: frequencyDayValue ?? 0,
    },
  } satisfies Omit<Item, "id">;

  $: disableApplyButton =
    labelValue === null ||
    fromValue === null ||
    priceValue === null ||
    currencyValue === null ||
    startValue === null ||
    frequencyYearValue === null ||
    frequencyMonthValue === null ||
    frequencyDayValue === null;

  $: queryClient = useQueryClient();
</script>

<Dialog bind:open escapeKeyAction="" scrimClickAction="" surface$style="width: 400px; max-width: calc(100vw - 32px);">
  <Title>{text.title[mode]}</Title>
  <Content>
    <div class="container">
      <TextField
        style="width: 100%;"
        helperLine$style="width: 100%;"
        variant="outlined"
        label="名前"
        required
        bind:value={labelValue}
        use={[InitialFocus]}
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
          label="請求額"
          required
          bind:value={priceValue}
        />
        <Autocomplete
          options={currencyCodes}
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
    </div>
  </Content>
  <Actions>
    <Button>
      <Label>キャンセル</Label>
    </Button>
    <Button
      action="apply"
      disabled={disableApplyButton}
      on:click={async () => {
        const itemData = queryClient.getQueryData([QUERY_KEYS.items]);
        if (!isItem(tempItem) || !isItemData(itemData)) throw new Error("えらー");
        if (mode === "add") await addItem(tempItem, itemData);
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.items],
        });
      }}
    >
      <Label>{text.applyButtonLabel[mode]}</Label>
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
