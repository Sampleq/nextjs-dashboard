// Next.js uses file-system routing where folders are used to create nested routes. Each folder represents a route segment that maps to a URL segment.
// To create a nested route, you can nest folders inside each other and add page.tsx files inside them.
// For example: /app/dashboard/page.tsx is associated with the path  /dashboard

// page.tsx is a special Next.js file that exports a React component, and it's required for the route to be accessible.

import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";

import { Suspense } from "react";

import CardWrapper from "@/app/ui/dashboard/cards";

import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";

// Now Page doesn't need to be async - since all async logic is inside components wrapped in Suspense

// In general, it's good practice to move your data fetches down to the components that need it, and then wrap those components in Suspense. But there is nothing wrong with streaming the sections or the whole page if that's what your application needs.
export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      {/* <Suspense fallback={<CardsSkeleton />}> */}
      <CardWrapper />
      {/* </Suspense> */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue} /> 
         we will fetch data inside <RevenueChart /> */}
        {/* Then, import <Suspense> from React, and wrap it around <RevenueChart />. You can pass it a fallback component called <RevenueChartSkeleton>. */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>

        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}

// By default, Next.js prerenders routes to improve performance, this is called Static Rendering. So if your data changes, it won't be reflected in your dashboard. - see chapter 8 - data renders (for Server Components) on moment of deploying or when revalidating data.

// What is Static Rendering? - With static rendering, data fetching and rendering happens on the server at build time (when you deploy) or when revalidating data.
// Static rendering is useful for UI with no data or data that is shared across users, such as a static blog post or a product page. It might not be a good fit for a dashboard that has personalized data which is regularly updated.

// What is Dynamic Rendering? - With dynamic rendering, content is rendered on the server for each user at request time (when the user visits the page).
// With dynamic rendering, your application is only as fast as your slowest data fetch.

// Streaming is a data transfer technique that allows you to break down a route into smaller "chunks" and progressively stream them from the server to the client as they become ready. By streaming, you can prevent slow data requests from blocking your whole page.
/*  There are two ways you implement streaming in Next.js:

    - At the page level, with the loading.tsx file (which creates <Suspense> for you).
    - At the component level, with <Suspense> for more granular control.  */

// Where you place your suspense boundaries will vary depending on your application. In general, it's good practice to move your data fetches down to the components that need it, and then wrap those components in Suspense. But there is nothing wrong with streaming the sections or the whole page if that's what your application needs.
