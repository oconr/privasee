import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "ui/components/ui/button";
import { Input } from "ui/components/ui/input";

export default async function SignupPage() {
  async function signup(formData: FormData) {
    "use server";
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    const response = await fetch("http://localhost:5001/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name,
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
        <h1 className="text-4xl font-semibold mb-4">Sign up</h1>
        <form action={signup} className="flex flex-col gap-2">
          <Input name="name" type="text" placeholder="Name" />
          <Input name="email" type="email" placeholder="Email address" />
          <Input name="password" type="password" placeholder="Password" />
          <Button type="submit">Sign up</Button>
          <Link
            href="/signin"
            className="text-center text-sm font-medium text-blue-900 hover:underline mt-2"
          >
            Already have an account? Sign in
          </Link>
        </form>
      </div>
    </div>
  );
}
