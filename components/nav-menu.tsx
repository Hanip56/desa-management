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
          label: "SK belum nikah",
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
        // {
        //   label: "Pendaftaran pindah WNI",
        //   href: "/pengajuan/pendaftaran-pindah-wni",
        // },
        // {
        //   label: "Keterangan tidak mampu",
        //   href: "/pengajuan/keterangan-tidak-mampu",
        // },
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
        <NavigationMenuList className="space-x-2">
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
                  {route.sub?.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      legacyBehavior
                      passHref
                      className="w-full"
                    >
                      <NavigationMenuLink
                        style={{ width: "18rem" }}
                        className={navigationMenuTriggerStyle({
                          className: cn(
                            "text-primary/80 bg-transparent text-center",
                            pathname === route.href && "bg-primary/10"
                          ),
                        })}
                      >
                        <div className="relative">
                          {route.notif && (
                            <div className="absolute w-[6px] h-[6px] rounded-full bg-red-500 top-0 -right-[5px]" />
                          )}
                          {route.label}
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  ))}
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
