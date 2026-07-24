"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ThemeChanger from "./DarkSwitch";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Product", href: "/product" },
    { name: "Features", href: "/" },
    { name: "Pricing", href: "/" },
    { name: "Company", href: "/" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <div className="w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-lg font-medium text-indigo-500 dark:text-gray-100 sm:text-xl">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm dark:bg-gray-800 sm:h-12 sm:w-12">
            <Image
              src="/img/SC Logo New.png"
              width={48}
              height={48}
              alt="Shan Cyber logo"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="truncate">Shan Cyber</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeChanger />

          <Link
            href="/"
            className="hidden rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 sm:inline-flex"
          >
            Get Started
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-500 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1">
            {navigation.map((menu) => (
              <li key={menu.href}>
                <Link
                  href={menu.href}
                  className="rounded-md px-4 py-2 text-base font-normal text-gray-800 transition hover:text-indigo-500 dark:text-gray-200"
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

