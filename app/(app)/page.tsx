import { MOCK_ITEMS } from "@/data/mock-data";

import ItemsBoard from "@/components/items/ItemsBoard";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-10 pb-28">
      <div className="mx-auto max-w-xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            My items
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Take your time before making a purchase.
          </p>
        </div>

        <ItemsBoard initialItems={MOCK_ITEMS} />
      </div>
    </main>
  );
}