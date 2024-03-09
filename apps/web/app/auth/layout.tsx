import Breadcrumbs from "./Breadcrumbs";
import Navigation from "./Navigation";
import UserMenu from "./UserMenu";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full flex flex-col">
      <header className="w-full h-14 bg-blue-500 flex flex-row items-center justify-between px-8 text-blue-100 sticky top-0 left-0">
        <div className="flex flex-row">
          <Breadcrumbs />
        </div>
        <div className="flex flex-row">
          <UserMenu />
        </div>
      </header>
      <Navigation />
      <div className="w-full flex flex-col p-6">{children}</div>
    </section>
  );
}
