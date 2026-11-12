import { MOCK_ITEMS } from "@/data/mock-data";

import ReadyItemCard from "@/components/items/ReadyItemCard";
import WaitingItemCard from "@/components/items/WaitingItemCard";

export default function Home() {
  const readyItems = MOCK_ITEMS.filter((item) => item.status === "ready");
  const waitingItems = MOCK_ITEMS.filter((item) => item.status === "waiting");

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10 pb-28">
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

        {/* Ready to review */}
        {readyItems.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Ready to review</h2>
              <span className="text-xs text-gray-500">
                {readyItems.length} items
              </span>
            </div>

            <div className="space-y-3">
              {readyItems.map((item) => (
                <ReadyItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Waiting */}
        {waitingItems.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Waiting</h2>
              <span className="text-xs text-gray-500">
                {waitingItems.length} items
              </span>
            </div>

            <div className="space-y-3">
              {waitingItems.map((item) => (
                <WaitingItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {readyItems.length === 0 && waitingItems.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="font-medium text-gray-900">Nothing here yet</h2>
            <p className="mt-2 text-sm text-gray-500">
              Add something to your wishlist and take your time deciding.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
