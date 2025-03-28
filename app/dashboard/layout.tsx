// In Next.js, you can use a special layout.tsx file to create UI that is shared between multiple pages.

// The <Layout /> component receives a children prop. This child can either be a page or another layout. In our case, the pages inside /dashboard will automatically be nested inside a <Layout />

import SideNav from "@/app/ui/dashboard/sidenav";

// export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
