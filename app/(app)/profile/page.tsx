import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function signOut() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const cardClass = "rounded-2xl border border-gray-200 bg-gray-50 p-6";

async function ProfileContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const { data, error } = await supabase
    .from("items")
    .select("status, price")
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to fetch profile stats: ", error);
    throw new Error("Failed to load your profile");
  }

  let droppedCount = 0;
  let boughtCount = 0;
  let decidingCount = 0;
  let savedAmount = 0;

  for (const row of data ?? []) {
    if (row.status === "dropped") {
      droppedCount += 1;
      savedAmount += Number(row.price);
    } else if (row.status === "bought") {
      boughtCount += 1;
    } else {
      decidingCount += 1;
    }
  }

  const stats = [
    { label: "Dropped", value: droppedCount },
    { label: "Bought", value: boughtCount },
    { label: "Still deciding", value: decidingCount },
  ];

  return (
    <>
      {/* Account */}
      <section
        className={`${cardClass} flex items-center justify-between gap-4`}
      >
        <div className="min-w-0">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="truncate text-sm font-medium text-gray-900">
            {user.email}
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white transition hover:bg-zinc-700"
          >
            Sign out
          </button>
        </form>
      </section>

      {/* Money saved */}
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7">
        <p className="text-sm font-medium text-emerald-700">Money saved</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight text-emerald-900">
          Rp {savedAmount.toLocaleString("id-ID")}
        </p>
        <p className="mt-2 text-sm text-emerald-700">
          Kept in your pocket by dropping {droppedCount}{" "}
          {droppedCount === 1 ? "item" : "items"}.
        </p>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className={`${cardClass} p-4 text-center`}>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </section>
    </>
  );
}

export default function Profile() {
  return (
    <main className="min-h-screen px-5 py-10 pb-28">
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Profile
        </h1>

        <Suspense
          fallback={<p className="text-sm text-gray-500">Loading...</p>}
        >
          <ProfileContent />
        </Suspense>
      </div>
    </main>
  );
}
