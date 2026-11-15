import { Suspense } from "react";
import BottomNav from "@/components/navigation/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-3xl min-h-screen">{children}</div>
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </>
  );
}
