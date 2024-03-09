"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  "use server";

  cookies().delete("session_jwt");
  redirect("/signin");
}
