<script lang="ts">
  import Card, { PrimaryAction } from "@smui/card";
  import { differenceInDays, format } from "date-fns";
  import type { Frequency, Item } from "../../types/ItemData";

  const getNextPaymentDate = (
    { start, frequency: { year, month, day } }: Pick<Item, "start" | "frequency">,
    now: Date
  ) => {
    if (year <= 0 && month <= 0 && day <= 0) throw new Error("invalid frequency values");
    const date = new Date(start);
    while (differenceInDays(now, date) > 1) {
      if (year) date.setFullYear(date.getFullYear() + 1);
      if (month) date.setMonth(date.getMonth() + 1);
      if (day) date.setDate(date.getDate() + 1);
    }
    return date;
  };

  const getFrequencyText = ({ year, month, day }: Frequency) => {
    let text = "";
    if (year) text += `${year}年`;
    if (month) text += `${month}月`;
    if (day) text += `${day}日`;
    return text;
  };

  export let item: Item;

  $: nextPaymentDate = getNextPaymentDate(item, new Date());
</script>

<Card>
  <PrimaryAction padded>
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
