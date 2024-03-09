"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "ui/components/ui/navigation-menu";

export default function Navigation() {
  return (
    <div className="p-6 border-b-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavItem href="/">My questions</NavItem>
          <NavItem href="/manage">Manage</NavItem>
          <NavItem href="/respond">Respond</NavItem>
          <NavItem href="/progress">Progress</NavItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

type NavItemProps = {
  href: string;
  children: React.ReactNode;
};

function NavItem({ href, children }: NavItemProps) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (pathname === "/" && href === pathname) {
      setIsActive(true);
    } else if (href !== "/" && pathname.startsWith(href)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [pathname, href]);

  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          active={isActive}
          className={navigationMenuTriggerStyle()}
        >
          {children}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
