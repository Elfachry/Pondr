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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-8 rounded-full bg-zinc-900 px-8 py-3 text-white shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                isActive ? "text-white" : "text-zinc-400"
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
