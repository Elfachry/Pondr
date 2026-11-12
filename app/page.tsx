import { MOCK_ITEMS } from "@/data/mock-data";

import ReadyItemCard from "@/components/items/ReadyItemCard";
import WaitingItemCard from "@/components/items/WaitingItemCard";

export default function Home() {
  const readyItems = MOCK_ITEMS.filter((item) => item.status === "ready");
  const waitingItems = MOCK_ITEMS.filter((item) => item.status === "waiting");

  return (
    <main className="flex flex-col gap-4 min-h-screen px-6 py-10">
      <h1 className="text-2xl">Home</h1>

      <section className="flex flex-col gap-2">
        <h2 className="font-bold">Ready to review</h2>

        {readyItems.map((item) => (
          <ReadyItemCard key={item.id} item={item} />
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-bold">Waiting</h2>

        {waitingItems.map((item) => (
          <WaitingItemCard key={item.id} item={item} />
        ))}
      </section>
    </main>
  );
}
