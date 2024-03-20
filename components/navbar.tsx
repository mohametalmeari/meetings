"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const path = usePathname();
  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Schedule", href: "/my_schedule" },
  ];
  return (
    <nav className="flex h-16 bg-violet-100 items-center px-5">
      <ul className="flex-1 flex gap-5">
        {links.map((link) => (
          <li
            key={link.href}
            className={cn(
              "text-gray-500 hover:text-gray-900 cursor-pointer transition-colors duration-200",
              path === link.href && "text-gray-900"
            )}
          >
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
      <UserButton />
    </nav>
  );
};
