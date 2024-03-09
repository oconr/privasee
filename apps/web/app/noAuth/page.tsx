import Link from "next/link";
import { Button } from "ui/components/ui/button";

export default function NoAuthLanding() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="border-2 px-8 py-6 rounded-lg w-96">
        <h1 className="text-4xl font-semibold">Welcome!</h1>
        <p className="text-md font-medium leading-5 mt-2">
          This is a demo project for Privasee by Ryan O&apos;Connor
        </p>
        <div className="flex flex-row gap-2 mt-4">
          <Button asChild variant="secondary" className="flex-1">
            <Link href="/signup">Sign up</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
