import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getItemById } from "@/lib/items";
import ResultView from "@/components/result/ResultView";
import { evaluateCheckIn, parseAnswers } from "@/lib/check-in-result";
import { getMotivationNote, getReasons } from "@/lib/reasons";

type Params = Promise<{ itemId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function ResultContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { itemId } = await params;
  const item = await getItemById(itemId);

  const answers = parseAnswers(await searchParams);
  if (!answers) redirect(`/items/${itemId}/check-in`);

  const { points, scores, recommendation, quadrant } = evaluateCheckIn(answers);

  return (
    <ResultView
      item={item}
      recommendation={recommendation}
      quadrant={quadrant}
      scores={scores}
      reasons={getReasons(answers, points, recommendation)}
      motivationNote={getMotivationNote(item.trigger, points)}
    />
  );
}

export default function ResultPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen pb-28">
      <div className="mx-auto max-w-xl px-5 py-12">
        <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
          <ResultContent params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}