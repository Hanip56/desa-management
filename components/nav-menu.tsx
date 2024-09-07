"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import MobileNavMenu from "./mobile-nav-menu";
import { useSession } from "next-auth/react";
import { pengajuanRoutes } from "@/contants";

export type Route = {
  label: string;
  href?: string;
  notif?: boolean;
  sub?: {
    label: string;
    href: string;
    notif?: boolean;
  }[];
};

const NavMenu = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const routes: Route[] = [];

  // hide the routes when ktpUrl & kkUrl doesnt valid
  if (
    session?.user.role !== "USER" ||
    (session?.user.ktpUrl && session.user.kkUrl)
  ) {
    routes.push(
      {
        label: "Beranda",
        href: "/",
      },
      {
        label: "Pengajuan",
        // notif: true,
        sub: pengajuanRoutes,
      },
      {
        label: "Profil",
        href: "/profil",
      }
    );
  }

  // routes just for admin
  if (session?.user.role !== "USER") {
    routes.push(
      {
        label: "Pengguna",
        href: "/pengguna",
      },
      {
        label: "Pengaturan",
        href: "/pengaturan",
      }
    );
  }

  return (
    <>
      {/* mobile sidebar */}
      <MobileNavMenu routes={routes} />
      {/* navbar */}
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList className="space-x-1">
          {routes.map((route) =>
            route.href ? (
              <NavigationMenuItem key={route.label}>
                <Link href={route.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle({
                      className: cn(
                        "text-primary-foreground/80 hover:text-primary-foreground bg-transparent hover:bg-primary-foreground/10 focus:bg-primary-foreground/20 focus:text-primary-foreground",
                        pathname === route.href &&
                          "bg-primary-foreground/20 text-primary-foreground"
                      ),
                    })}
                  >
                    {route.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={route.label}>
                <NavigationMenuTrigger className="bg-transparent text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5 focus:bg-primary-foreground/20 focus:text-primary-foreground">
                  <div className="relative">
                    {route.notif && (
                      <div className="absolute w-[6px] h-[6px] rounded-full bg-red-500 top-0 -right-[5px]" />
                    )}
                    {route.label}
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {route.sub?.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle({
                            className: cn(
                              "block select-none space-y-1 rounded-md p-3 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === route.href && "bg-sky-50/80"
                            ),
                          })}
                          style={{ width: "100%" }}
                        >
                          <div className="w-full text-sm font-medium">
                            {route.label}
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default NavMenu;
