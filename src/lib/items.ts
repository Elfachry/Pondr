import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Item } from "@/types";

export async function getItemById(itemId: string): Promise<Item> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const { data, error } = await supabase
    .from("items")
    .select(
      "id, name, price, trigger, reason, image_url, created_at, review_at, status",
    )
    .eq("id", itemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch item:", error);
    notFound();
  }
  if (!data) notFound();

  return {
    id: data.id,
    name: data.name,
    price: Number(data.price),
    trigger: data.trigger as Item["trigger"],
    reason: data.reason ?? undefined,
    imageUrl: data.image_url ?? undefined,
    createdAt: data.created_at,
    reviewAt: data.review_at,
    status: data.status as Item["status"],
  };
}