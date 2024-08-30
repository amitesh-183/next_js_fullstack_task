"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userRole = session?.user?.role?.toLowerCase();
  const shouldHideHeader = pathname === "/login" || pathname === "/register";
  return (
    <header
      className={`bg-black/20 backdrop-blur-sm max-w-6xl px-8 mx-auto my-2 rounded-full shadow text-black p-4 
        // ${
          shouldHideHeader
            ? "fixed w-full flex left-1/2 top-0 translate-x-[-50%] translate-y-[0%] text-white"
            : ""
        }
      `}
    >
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          <h1>
            Mana<span className="text-pink-600">GX</span>
          </h1>
        </Link>
        <ul className="flex items-center space-x-4">
          {session ? (
            <>
              <li>
                <Link
                  href={`/dashboard/${userRole}`}
                  className={` border-b-4 hover:border-pink-600 ${
                    pathname.includes("/dashboard")
                      ? "border-pink-600"
                      : " border-transparent"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={`/profile`}
                  className={` border-b-4 hover:border-pink-600 ${
                    pathname.includes("/profile")
                      ? "border-pink-600"
                      : " border-transparent"
                  }`}
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  className="bg-pink-400 text-white hover:bg-pink-500 duration-500 px-4 py-1 rounded-full"
                  onClick={() => {
                    signOut({ callbackUrl: "/login" });
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="bg-pink-600 text-white hover:bg-pink-500 border border-transparent hover:border-white duration-500 px-4 py-1 rounded-full"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="bg-transparent border text-white hover:bg-pink-500 duration-500 px-4 py-1 rounded-full"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
