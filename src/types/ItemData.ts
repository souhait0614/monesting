export interface Frequency {
  year: number;
  month: number;
  day: number;
}

export interface Item {
  label: string;
  price: number;
  currency: string;
  start: Date;
  frequency: Frequency;
}

export interface ItemData {
  formatVersion: "1";
  items: Item[];
}
