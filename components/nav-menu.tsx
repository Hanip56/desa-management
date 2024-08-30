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

  const routes: Route[] = [
    {
      label: "Beranda",
      href: "/",
    },
    {
      label: "Pengajuan",
      // notif: true,
      sub: [
        {
          label: "Surat kelahiran",
          href: "/pengajuan/surat-kelahiran",
        },
        {
          label: "Surat kematian",
          href: "/pengajuan/surat-kematian",
        },
        {
          label: "SK belum menikah",
          href: "/pengajuan/sk-belum-menikah",
        },
        {
          label: "SK ijin keramaian",
          href: "/pengajuan/sk-ijin-keramaian",
        },
        {
          label: "SK penghasilan orang tua",
          href: "/pengajuan/sk-penghasilan-orang-tua",
        },
        {
          label: "SK izin bekerja",
          href: "/pengajuan/sk-izin-bekerja",
        },
        {
          label: "SK belum memiliki rumah",
          href: "/pengajuan/sk-belum-memiliki-rumah",
        },
        {
          label: "SK tidak memiliki pekerjaan",
          href: "/pengajuan/sk-tidak-memiliki-pekerjaan",
        },
        {
          label: "SK usaha",
          href: "/pengajuan/sk-usaha",
        },
        {
          label: "SK tidak mampu",
          href: "/pengajuan/sk-tidak-mampu",
        },
        {
          label: "SK domisili sementara",
          href: "/pengajuan/sk-domisili-sementara",
        },
        {
          label: "SK domisili imigrasi",
          href: "/pengajuan/sk-domisili-imigrasi",
        },
        {
          label: "SK domisili lembaga",
          href: "/pengajuan/sk-domisili-lembaga",
        },
      ],
    },
    {
      label: "Profil",
      href: "/profil",
    },
  ];

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
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === route.href && "bg-sky-50/80"
                            ),
                          })}
                          style={{ width: "100%" }}
                        >
                          <div className="w-full text-sm font-medium leading-none">
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
