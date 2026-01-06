"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { CartSheet } from "@/components/cart/cart-sheet";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Products", href: "/products" },
  { name: "Roadmap", href: "/roadmap" },
  { name: "About", href: "/about" },
  { name: "Interest Check", href: "/interest-check" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl tracking-tighter hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            aria-label="CATMAT - Home"
          >
            CATMAT
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <ul className="flex gap-8" role="list">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-foreground/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-1",
                      pathname === item.href
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            {/* <CartSheet /> */}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            {/* <CartSheet /> */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                aria-describedby="mobile-nav-description"
              >
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription id="mobile-nav-description">
                    Browse our site sections
                  </SheetDescription>
                </SheetHeader>
                <nav aria-label="Mobile navigation">
                  <ul className="flex flex-col px-4" role="list">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "block text-lg font-medium transition-colors hover:text-foreground/80 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
                            pathname === item.href
                              ? "text-foreground"
                              : "text-foreground/60"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={
                            pathname === item.href ? "page" : undefined
                          }
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
