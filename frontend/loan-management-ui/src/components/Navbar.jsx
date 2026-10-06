"use client";

import { Landmark, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const displayName = user?.username || user?.email || "Account";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="LoanFlow home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#0f3d5e] text-white">
            <Landmark size={19} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Loan<span className="text-[#0f3d5e]">Flow</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-7">
          <a
            href="#dashboard"
            className="hidden text-sm font-medium text-slate-600 transition hover:text-[#0f3d5e] sm:block"
          >
            Dashboard
          </a>
          <a
            href="#applications"
            className="hidden text-sm font-medium text-slate-600 transition hover:text-[#0f3d5e] sm:block"
          >
            Applications
          </a>
          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-6">
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
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-[#0f3d5e] hover:text-[#0b314b]"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
