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

export type Route = {
  label: string;
  href?: string;
  sub?: {
    label: string;
    href: string;
  }[];
};

const NavMenu = () => {
  const pathname = usePathname();

  const routes: Route[] = [
    {
      label: "Beranda",
      href: "/",
    },
    {
      label: "Pengajuan",
      sub: [
        {
          label: "Surat kelahiran",
          href: "/pengajuan/surat-kelahiran",
        },
        {
          label: "Surat belum nikah",
          href: "/pengajuan/surat-belum-nikah",
        },
        {
          label: "Keterangan penghasilan orang tua",
          href: "/pengajuan/keterangan-penghasilan-orang-tua",
        },
        {
          label: "Keterangan ijin keramaian",
          href: "/pengajuan/keterangan-ijin-keramaian",
        },
        {
          label: "Surat kematian",
          href: "/pengajuan/surat-kematian",
        },
        {
          label: "Pendaftaran pindah WNI",
          href: "/pengajuan/pendaftaran-pindah-wni",
        },
        {
          label: "Keterangan tidak mampu",
          href: "/pengajuan/keterangan-tidak-mampu",
        },
      ],
    },
    {
      label: "Profil",
      href: "/profil",
    },
    {
      label: "Pengguna",
      href: "/pengguna",
    },
    {
      label: "Pengaturan",
      href: "/pengaturan",
    },
  ];

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
                  {route.label}
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
                        {route.label}
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
