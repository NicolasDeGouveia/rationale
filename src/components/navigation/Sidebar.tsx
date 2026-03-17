"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { APP_NAME } from "@/lib/constants";
import { NAV_ICONS } from "./NavIcons";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: NAV_ICONS.dashboard },
  { href: "/decisions", label: "Décisions", icon: NAV_ICONS.decisions },
  { href: "/review", label: "Révision", icon: NAV_ICONS.review },
  { href: "/search", label: "Recherche", icon: NAV_ICONS.search },
  { href: "/settings", label: "Paramètres", icon: NAV_ICONS.settings },
];

interface SidebarProps {
  workspaceName?: string;
  reviewCount?: number;
}

export function Sidebar({ workspaceName, reviewCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <aside className="flex h-full flex-col px-3 py-4">
      <div className="mb-6 px-2">
        <p className="text-xs font-semibold text-neutral-900 truncate">{APP_NAME}</p>
        {workspaceName && (
          <p className="text-xs text-neutral-400 truncate mt-0.5">{workspaceName}</p>
        )}
      </div>
      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const showBadge = item.href === "/review" && reviewCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-neutral-100 text-neutral-900 font-medium"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="ml-auto text-xs bg-red-100 text-red-700 font-semibold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                  {reviewCount > 99 ? "99+" : reviewCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors rounded-md hover:bg-neutral-50 mt-2"
      >
        {NAV_ICONS.signOut}
        Se déconnecter
      </button>
    </aside>
  );
}
