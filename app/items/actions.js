"use server";

import { addItem } from "@/lib/queries/items";

export async function createItem(formData) {
  const item = formData.get("item");
  await addItem(item);
}
