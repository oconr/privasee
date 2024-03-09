"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "ui/components/ui/breadcrumb";
import { LuHome } from "react-icons/lu";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <LuHome className="text-lg text-blue-50" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <LuHome className="text-lg text-blue-50" />
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-blue-200">/</BreadcrumbSeparator>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
