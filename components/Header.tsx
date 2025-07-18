"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuIcon, X, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { INavLinks } from "@/lib/data";
import { getTokenFromCookies } from "@/lib/cookies";
import { INavLink } from "@/lib/types";
import { disableHeaderWithFooter } from "@/utils/disableHeaderWithFooter";
import { FaCartArrowDown } from "react-icons/fa6";
import { useCart } from "@/contexts/CartContext";
import { useRole } from "@/contexts/RoleContext";

// Type guard for dropdown items
function isDropdownLink(item: INavLink): item is INavLink & {
  subLinks: Array<{ label: string; href: string }>;
} {
  return !!item.subLinks && item.subLinks.length > 0;
}

const styles = `
`;

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpenCart, setIsOpenCart] = useState(false);
  const { cartItems, cartCount, removeFromCart, cartTotal, isBouncing } =
    useCart();
  const { isAuthenticated, userData } = useRole();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted || !isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const token = getTokenFromCookies();
    if (token) setHasToken(true);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const closeMenu = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (label: string) =>
    setOpenDropdown(openDropdown === label ? null : label);
  const isActive = (href: string) => pathname === href;

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const shouldHideHeader = disableHeaderWithFooter.some((path) => {
    const pattern = path.replace(/\[.*\]/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  });

  if (shouldHideHeader) return null;

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const navVariants = {
    hidden: { clipPath: "circle(0% at 100% 0%)", opacity: 0 },
    visible: {
      clipPath: "circle(150% at 100% 0%)",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
        duration: 0.1,
        when: "withChildren",
        staggerChildren: 0.02,
        delayChildren: 0.08,
      },
    },
    exit: {
      clipPath: "circle(0% at 100% 0%)",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 30,
        duration: 0.2,
        when: "withChildren",
        staggerDirection: -1,
        staggerChildren: 0.02,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.1 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.1 } },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const getDashboardRoute = (role?: string) => {
    switch (role) {
      case "student":
        return "/dashboard/student";
      case "individualTechProfessional":
        return "/dashboard/tech-professional";
      case "institution":
        return "/dashboard/institution";
      case "employer":
        return "/dashboard/company";
      case "admin":
        return "/dashboard/admin";
      default:
        return "/dashboard/student";
    }
  };

  return (
    <>
      <style>{styles}</style>
      <header
        className={`fixed top-0 w-full z-30 px-2 md:px-16 h-[15vh] flex justify-between items-center transition-all duration-300 ${
          isScrolled
            ? "bg-primary shadow-md backdrop-blur-[18px]"
            : "bg-primary"
        }`}
      >
        <Link href="/">
          <Image
            src="/assets/techedusolution.jpg"
            alt="Tech Edu Solution Logo"
            width={80}
            height={80}
            className="rounded-[5px]"
          />
        </Link>

        {/* Desktop NavLinks */}
        <nav className="hidden min-[1200px]:flex items-center gap-4 text-[1rem]">
          {INavLinks.map((item, index) =>
            isDropdownLink(item) ? (
              <div key={index} className="relative group">
                <div className="flex items-center gap-1 cursor-pointer text-white hover:text-blue-400 group">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-white hover:text-blue-400 capitalize py-1 "
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="capitalize py-1">{item.label}</span>
                  )}
                  <span className="select-none text-white group-hover:text-blue-400 mt-1">
                    <ChevronDown size={18} />
                  </span>
                </div>
                {/* Transparent bridge to prevent gap */}
                <div className="absolute left-0 top-full w-full h-2 bg-transparent"></div>
                {/* Dropdown on hover */}
                <div className="absolute left-0 top-full min-w-[200px] bg-white text-gray-900 rounded-[10px] border-6 border-[#011F72] shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-200 z-40">
                  <ul className="">
                    {item.subLinks.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className="block px-4 py-2 hover:bg-blue-100 hover:font-semibold hover:text-[#011F72] hover:border-b-2 hover:border-blue-950 transition-colors duration-150 whitespace-nowrap"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={index}
                href={item.href!}
                className={`capitalize px-2 py-1 ${
                  isActive(item.href!)
                    ? "text-blue-400 font-bold hover:text-blue-500"
                    : "text-white hover:text-blue-400"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-4">
          {!hasToken && (
            <Link
              href="/login"
              className="text-[14px] font-semibold text-white border-2 border-blue-600 bg-blue-600 hover:bg-blue-400 hover:border-blue-400 px-6 py-2 rounded-[8px] hidden md:block"
            >
              Login
            </Link>
          )}
          <Link
            href={hasToken ? getDashboardRoute(userData?.role) : "/get-started"}
            className="text-[14px] font-semibold border-2 border-blue-600 hover:border-blue-400 text-white px-4 py-2 rounded-[8px]"
          >
            {hasToken ? "Dashboard" : "Get Started"}
          </Link>
          <div
            className="relative text-left"
            onMouseEnter={() => setIsOpenCart(true)}
            onMouseLeave={() => {
              // Add a small delay to allow moving mouse to dropdown
              setTimeout(() => {
                const dropdown = document.getElementById("cart-dropdown");
                if (dropdown && !dropdown.matches(":hover")) {
                  setIsOpenCart(false);
                }
              }, 100);
            }}
          >
            <Link href="/cart" className="focus:outline-none">
              <div className={`relative ${isBouncing ? "animate-bounce" : ""}`}>
                <FaCartArrowDown
                  size={25}
                  className="text-white hover:text-blue-400 mt-2"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {isOpenCart && (
              <div
                id="cart-dropdown"
                role="menu"
                className="absolute right-0 top-full mt-2 w-80 origin-top-right rounded-[10px] shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none p-4 z-50"
                onMouseEnter={() => setIsOpenCart(true)}
                onMouseLeave={() => setIsOpenCart(false)}
              >
                {cartItems.length === 0 ? (
                  <div className="text-center">
                    <p className="text-gray-800 font-semibold mb-2">
                      🛒 Empty Cart
                    </p>
                    <Link
                      href="/training/catalog"
                      className="text-[#011F72] hover:underline font-medium block"
                      role="menuitem"
                    >
                      Explore Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Cart ({cartCount})
                      </h3>
                      <Link
                        href="/cart"
                        className="text-sm text-[#011F72] hover:underline"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {cartItems.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-[10px]"
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(item.price || 0)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            aria-label="Remove from cart"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {cartItems.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{cartItems.length - 3} more items
                      </p>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-800">
                          Total:
                        </span>
                        <span className="font-bold text-[#011F72]">
                          {formatCurrency(cartTotal)}
                        </span>
                      </div>

                      {!isAuthenticated && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-3 mb-3">
                          <p className="text-xs text-yellow-700 mb-2">
                            Login required to checkout
                          </p>
                          <Link
                            href="/login"
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-3 rounded text-xs font-medium transition-colors"
                          >
                            Login to Continue
                          </Link>
                        </div>
                      )}

                      <Link
                        href="/cart"
                        className={`w-full text-center py-2 px-4 rounded-[10px] font-medium transition-colors ${
                          isAuthenticated
                            ? "bg-[#011F72] hover:bg-blue-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isAuthenticated ? "Checkout" : "View Cart"}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            className="min-[1200px]:hidden inline-block"
          >
            <MenuIcon size={30} className="text-white inline-block" />
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.nav
              ref={navRef}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={navVariants}
              className="fixed top-0 right-0 h-screen w-full bg-gray-800/70 backdrop-blur-[18px] text-white z-50 px-6 pt-4 pb-12 overflow-y-auto flex justify-center"
            >
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="fixed top-6 right-2 md:right-8 w-24 h-12 p-4"
              >
                <X size={40} className="text-white bg-[#011F72] rounded" />
              </button>

              <motion.ul className="mt-16 lg:max-w-[30vw] space-y-2 text-lg uppercase">
                {INavLinks.map((item, index) => {
                  const isLastItem = index === INavLinks.length - 1;

                  return (
                    <motion.li key={index} variants={linkVariants}>
                      {isDropdownLink(item) ? (
                        <div>
                          <div className="flex items-center justify-center gap-1 hover:text-blue-400">
                            {item.href ? (
                              <Link
                                href={item.href}
                                onClick={closeMenu}
                                className="uppercase"
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <span className="uppercase">{item.label}</span>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleDropdown(item.label)}
                              className="p-1"
                            >
                              {openDropdown === item.label
                                ? // <ChevronUp size={18} />
                                  "▲"
                                : // <ChevronDown size={18} />
                                  "▼"}
                            </button>
                          </div>

                          <AnimatePresence>
                            {openDropdown === item.label && (
                              <motion.ul
                                className="mt-2 space-y-2 text-[1rem] text-gray-300 text-center"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={{
                                  hidden: { opacity: 0, y: -10 },
                                  visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { staggerChildren: 0.05 },
                                  },
                                  exit: { opacity: 0, y: -10 },
                                }}
                              >
                                {item.subLinks.map((sub) => (
                                  <motion.li
                                    key={sub.href}
                                    variants={linkVariants}
                                    onClick={closeMenu}
                                  >
                                    <Link
                                      href={sub.href}
                                      className={`block uppercase ${
                                        isActive(sub.href)
                                          ? "text-blue-400 font-medium"
                                          : "hover:text-[#011F72] hover:pl-4 transition-all duration-300 ease-in-out"
                                      }`}
                                    >
                                      {sub.label}
                                    </Link>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href!}
                          onClick={closeMenu}
                          className={`desktop-nav-link inline-block justify-self-center uppercase text-center w-full px-10 py-2 rounded-md transition-colors duration-300 
                            ${
                              isActive(item.href!)
                                ? "text-blue-400 font-medium"
                                : "hover:text-white"
                            }
                              `}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
                {!hasToken && (
                  <Link
                    href="/login"
                    className="text-[14px] font-semibold text-white border-2 border-blue-600 bg-blue-600 hover:bg-blue-400 hover:border-blue-400 px-6 py-2 rounded-[8px] block text-center mt-4"
                  >
                    Login
                  </Link>
                )}
              </motion.ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
