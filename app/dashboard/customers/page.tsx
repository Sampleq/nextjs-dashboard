// page.tsx is a special Next.js file that exports a React component, and it's required for the route to be accessible.

import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page() {
  await new Promise<void>(res =>
    setTimeout(() => {
      res();
    }, 100)
  );
  return <p>Customers Page</p>;
}
