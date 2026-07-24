"use client";
import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";

export default function Navbar() {
  const navigation = [
    { name: "Product", href: "/product" },
    { name: "Features", href: "/" },
    { name: "Pricing", href: "/" },
    { name: "Company", href: "/" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <div className="w-full border-b border-gray-100 bg-white/90 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/90">
      <nav className="container relative mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 text-lg font-medium text-indigo-500 dark:text-gray-100 sm:text-xl">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm dark:bg-gray-800">
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

        <div className="flex items-center gap-2 sm:gap-3 lg:order-3">
          <ThemeChanger />
          <Link
            href="/"
            className="hidden rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 sm:inline-flex"
          >
            Get Started
          </Link>

          <Disclosure as="div" className="lg:hidden">
            {({ open }) => (
              <>
                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 transition hover:bg-indigo-100 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <svg
                    className="h-6 w-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    {open ? (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="basis-full lg:hidden">
                  <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    {navigation.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-500 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      href="/"
                      className="mt-2 flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      Get Started
                    </Link>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>

        <div className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {navigation.map((menu, index) => (
              <li key={index}>
                <Link
                  href={menu.href}
                  className="rounded-md px-4 py-2 text-base font-normal text-gray-800 transition hover:text-indigo-500 focus:outline-none dark:text-gray-200"
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}

