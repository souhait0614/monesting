<script lang="ts">
  import Card, { PrimaryAction } from "@smui/card";
  import { format, subDays } from "date-fns";
  import Button from "@smui/button";
  import Dialog, { Title, Actions, Content } from "@smui/dialog";
  import TextField from "@smui/textfield";
  import Switch from "@smui/switch";
  import FormField from "@smui/form-field";
  import { createMutation, useIsMutating, useQueryClient } from "@tanstack/svelte-query";
  import { isItemV3, type ItemV3 } from "../../types/ItemV3";
  import { isItemDataV3 } from "../../types/ItemData";
  import { getNextPaymentDate } from "$lib/util";
  import { MUTATION_KEYS, QUERY_KEYS } from "$lib/const";
  import { updateItem } from "$lib/item";
  import { setItemData } from "$lib/fetch";
  import { notificationNotUpdated } from "$lib/store";

  export let item: ItemV3;

  let enableSend = false;
  let sendValue = 0;

  let openSetSendDialog = false;

  $: nextPaymentDate = getNextPaymentDate(item, new Date());

  $: setItemDataMutation = createMutation({
    mutationFn: setItemData,
    mutationKey: [MUTATION_KEYS.itemData],
  });

  $: isMutatingSetItemData = useIsMutating([MUTATION_KEYS.itemData]);

  $: queryClient = useQueryClient();

  const handleUpdate = async () => {
    const tempItem: ItemV3 = {
      ...item,
      sendNotification: enableSend ? sendValue : false,
    };
    const itemData = queryClient.getQueryData([QUERY_KEYS.itemData]);
    if (!isItemV3(tempItem) || !isItemDataV3(itemData)) throw new Error("えらー");
    const newItemData = updateItem(tempItem, itemData);
    queryClient.setQueryData([QUERY_KEYS.itemData], newItemData);
    await $setItemDataMutation.mutateAsync(newItemData);
    $notificationNotUpdated = true;
  };
</script>

<Card>
  <PrimaryAction
    padded
    on:click={() => {
      enableSend = Boolean(item.sendNotification);
      sendValue = item.sendNotification || 1;
      openSetSendDialog = true;
    }}
  >
    <div class="grid">
      <div>
        <p class="mdc-typography--headline6" style="margin: 0;">{item.label}</p>
        <p class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
          請求: {format(nextPaymentDate, "yyyy/MM/dd")}
        </p>
      </div>
      <div>
        <p class="mdc-typography--headline6" style="margin: 0;">
          {item.sendNotification ? `${item.sendNotification}日前に通知` : "オフ"}
        </p>
        {#if item.sendNotification}
          <p class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
            次回通知: {format(subDays(nextPaymentDate, item.sendNotification), "yyyy/MM/dd")}
          </p>
        {/if}
      </div>
    </div>
  </PrimaryAction>
</Card>

<Dialog bind:open={openSetSendDialog} escapeKeyAction="" scrimClickAction="">
  <Title>通知</Title>
  <Content>
    <div class="stack">
      <FormField>
        <Switch bind:checked={enableSend} icons={false} />
        <span slot="label">通知を有効にする</span>
      </FormField>
      <TextField
        style="width: 100%;"
        helperLine$style="width: 100%;"
        variant="outlined"
        type="number"
        input$step={1}
        input$min={1}
        label="n日前に通知"
        required
        disabled={!enableSend}
        bind:value={sendValue}
      />
    </div>
  </Content>
  <Actions>
    <Button>キャンセル</Button>
    <Button on:click={() => handleUpdate()} action="apply" disabled={Boolean($isMutatingSetItemData)}>更新</Button>
  </Actions>
</Dialog>

<style lang="scss">
  .grid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    p {
      word-break: break-all;
    }
    > div:nth-of-type(2) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: end;
    }
  }
  .stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
