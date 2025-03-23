// Next.js uses file-system routing where folders are used to create nested routes. Each folder represents a route segment that maps to a URL segment.
// To create a nested route, you can nest folders inside each other and add page.tsx files inside them.
// For example: /app/dashboard/page.tsx is associated with the path  /dashboard

import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';

import {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
} from '@/app/lib/data';

// The page is an async Server Component. This allows you to use await to fetch data.
export default async function Page() {
  // // OPT 1 - we make a request waterfall
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();

  const cardData = await fetchCardData();
  const {
    numberOfCustomers,
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
  } = cardData;
  // // Due await The data requests are unintentionally blocking each other, creating a request waterfall - a sequence of network requests that depend on the completion of previous requests.
  // // This pattern is not necessarily bad. There may be cases where you want waterfalls because you want a condition to be satisfied before you make the next request. For example, you might want to fetch a user's ID and profile information first. Once you have the ID, you might then proceed to fetch their list of friends. In this case, each request is contingent on the data returned from the previous request.
  // // However, this behavior can also be unintentional and impact performance.

  // // // OPT 2 - My - we can prevent request waterfall via using await Promise.all( .. )
  // // // However, there is one disadvantage of relying only on this JavaScript pattern (Promise.all) : what happens if one data request is slower than all the others? Let's find out more in the next 8 chapter.
  // const asyncData = await Promise.all([
  //   fetchRevenue(),
  //   fetchLatestInvoices(),
  //   fetchCardData(),
  // ]);

  // const [
  //   revenue,
  //   latestInvoices,
  //   {
  //     numberOfCustomers,
  //     numberOfInvoices,
  //     totalPaidInvoices,
  //     totalPendingInvoices,
  //   },
  //   // cardData
  // ] = asyncData;
  // // const {
  // //   numberOfCustomers,
  // //   numberOfInvoices,
  // //   totalPaidInvoices,
  // //   totalPendingInvoices,
  // // } = cardData;

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <Card title='Collected' value={totalPaidInvoices} type='collected' />
        <Card title='Pending' value={totalPendingInvoices} type='pending' />
        <Card title='Total Invoices' value={numberOfInvoices} type='invoices' />
        <Card
          title='Total Customers'
          value={numberOfCustomers}
          type='customers'
        />
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'>
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}

// By default, Next.js prerenders routes to improve performance, this is called Static Rendering. So if your data changes, it won't be reflected in your dashboard. - see chapter 8

// What is Static Rendering? - With static rendering, data fetching and rendering happens on the server at build time (when you deploy) or when revalidating data.
// Static rendering is useful for UI with no data or data that is shared across users, such as a static blog post or a product page. It might not be a good fit for a dashboard that has personalized data which is regularly updated.

// What is Dynamic Rendering? - With dynamic rendering, content is rendered on the server for each user at request time (when the user visits the page).
// With dynamic rendering, your application is only as fast as your slowest data fetch.
// Streaming is a data transfer technique that allows you to break down a route into smaller "chunks" and progressively stream them from the server to the client as they become ready. By streaming, you can prevent slow data requests from blocking your whole page.
/*  There are two ways you implement streaming in Next.js:

    - At the page level, with the loading.tsx file (which creates <Suspense> for you).
    - At the component level, with <Suspense> for more granular control.  */
