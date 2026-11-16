import { Suspense } from "react";
import { getItemById } from "@/lib/items";
import CheckInFlow from "@/components/check-in/CheckInFlow";

type Params = Promise<{ itemId: string }>;

async function CheckInContent({ params }: { params: Params }) {
  const { itemId } = await params;
  const item = await getItemById(itemId);

  return <CheckInFlow item={item} />;
}

export default function CheckInPage({ params }: { params: Params }) {
  return (
    <main className="min-h-screen pb-12">
      <div className="mx-auto max-w-xl px-5 py-12">
        <Suspense
          fallback={<p className="text-sm text-gray-500">Loading...</p>}
        >
          <CheckInContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}