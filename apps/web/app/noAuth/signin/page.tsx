import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "ui/components/ui/button";
import { Input } from "ui/components/ui/input";

export default async function SigninPage() {
  async function signin(formData: FormData) {
    "use server";
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch("http://localhost:5001/auth/signin", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const session = data.session;

    cookies().set("session_jwt", session, {
      path: "/",
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    redirect("/");
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="border-2 px-8 py-6 rounded-lg w-96">
        <h1 className="text-4xl font-semibold mb-4">Sign in</h1>
        <form action={signin} className="flex flex-col gap-2">
          <Input name="email" type="email" placeholder="Email address" />
          <Input name="password" type="password" placeholder="Password" />
          <Button type="submit">Sign in</Button>
          <Link
            href="/signup"
            className="text-center text-sm font-medium text-blue-900 hover:underline mt-2"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </form>
      </div>
    </div>
  );
}
