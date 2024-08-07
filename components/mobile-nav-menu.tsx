"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Route } from "./nav-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useEffect, useState } from "react";
import Logo from "./logo";

const LinkItem = ({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) => (
  <Link href={href ?? ""} key={href}>
    <div
      className={cn(
        "py-3 px-4 flex gap-2 items-center font-semibold transition",
        pathname === href
          ? "text-black"
          : "text-gray-400 hover:text-emerald-700"
      )}
    >
      <span className="text-sm">{label}</span>
    </div>
  </Link>
);

const MobileNavMenu = ({ routes }: { routes: Route[] }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
    }
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={handleChange}>
      <SheetTrigger className="md:hidden" onClick={() => setOpen(true)}>
        <Menu className="text-white w-6 h-6" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-[80%] h-full sm:w-80 text-white overflow-y-auto"
      >
        <div className="py-8 px-4 bg-emerald-700 text-white">
          <Logo />
        </div>
        <nav className="my-6 px-3">
          {routes.map((route) => {
            return route.href ? (
              <Link href={route.href ?? ""} key={route.href}>
                <div
                  className={cn(
                    "py-3 px-4 flex gap-2 items-center font-semibold transition",
                    pathname === route.href
                      ? "ring-1 ring-emerald-600 text-emerald-700 shadow-sm rounded-md"
                      : "text-gray-400 hover:text-emerald-700"
                  )}
                >
                  <span className="text-sm">{route.label}</span>
                </div>
              </Link>
            ) : (
              <Accordion type="single" collapsible key={route.label}>
                <AccordionItem
                  value="item-1"
                  className="border-none py-1 px-4 text-sm text-gray-400 hover:text-black"
                >
                  <AccordionTrigger className="hover:no-underline hover:text-emerald-700">
                    {route.label}
                  </AccordionTrigger>
                  <AccordionContent>
                    {route.sub?.map((sub) => (
                      <LinkItem
                        key={sub.href}
                        href={sub.href ?? ""}
                        label={sub.label}
                        pathname={pathname}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavMenu;
