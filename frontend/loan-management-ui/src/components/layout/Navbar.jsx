"use client";

import { Landmark, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Only rendered for logged-in users (the page is wrapped in RequireAuth),
// so there is no "are you logged in?" branch here.
// Dashboard / Applications links were removed: they pointed nowhere.
// Add them back when those pages exist.
export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const displayName = user?.username || user?.email || "Account";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="LoanFlow home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
            <Landmark size={19} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Loan<span className="text-primary">Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/15">
              Admin
            </span>
          )}
          <span className="hidden max-w-40 truncate text-sm text-slate-600 sm:block">
            {displayName}
          </span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Log out"
          >
            <LogOut size={17} aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
