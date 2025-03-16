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
