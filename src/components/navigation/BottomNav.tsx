
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, UserRound } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Add",
    href: "/add",
    icon: Plus,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.endsWith("/check-in")) return null;

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full bg-zinc-900 px-6 py-2 text-white shadow-lg">

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isAdd = item.label === "Add";

          if (isAdd) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label="Add item"
                className="group -mt-6 flex flex-col items-center gap-1"
              >
                <div className="flex h-14 w-18 items-center justify-center rounded-full border-2 border-zync-900 bg-white text-zinc-900 shadow-lg transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-xl group-active:scale-95">
                  <Plus size={26} strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}

      </div>
    </nav>
  );
}
