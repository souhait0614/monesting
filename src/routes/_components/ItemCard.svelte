<script lang="ts">
  import Card, { PrimaryAction } from "@smui/card";
  import { format } from "date-fns";
  import type { Frequency, Item } from "../../types/ItemData";
  import EditItemModal from "./EditItemModal.svelte";
  import { getNextPaymentDate } from "$lib/util";

  const getFrequencyText = ({ year, month, day }: Frequency) => {
    let text = "";
    if (year) text += `${year}年`;
    if (month) text += `${month}月`;
    if (day) text += `${day}日`;
    return text;
  };

  export let item: Item;

  let openEditItemModal = false;

  $: nextPaymentDate = getNextPaymentDate(item, new Date());
</script>

<Card>
  <PrimaryAction
    padded
    on:click={() => {
      openEditItemModal = true;
    }}
  >
    <div class="grid">
      <div>
        <p class="mdc-typography--headline6" style="margin: 0;">{item.label}</p>
        <p class="mdc-typography--subtitle2" style="margin: 0; color: #888;">{item.from}</p>
      </div>
      <div>
        <p class="mdc-typography--headline6" style="margin: 0;">{format(nextPaymentDate, "yyyy/MM/dd")}</p>
        <p class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
          {item.price}
          {item.currency} / {getFrequencyText(item.frequency)}
        </p>
      </div>
    </div>
  </PrimaryAction>
</Card>

{#if openEditItemModal}
  <EditItemModal bind:open={openEditItemModal} mode="update" defaultValue={item} />
{/if}

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
</style>
