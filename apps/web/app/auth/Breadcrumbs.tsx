"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "ui/components/ui/breadcrumb";
import { LuHome } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

function capitalise(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
        {pathname
          .split("/")
          .slice(1)
          .map((path) => {
            return (
              <Fragment key="path">
                <BreadcrumbSeparator className="text-blue-200">
                  /
                </BreadcrumbSeparator>
                <BreadcrumbItem className="text-blue-50">
                  {capitalise(path.replace("-", " "))}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
