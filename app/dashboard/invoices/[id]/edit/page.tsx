import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  // http://localhost:3000/dashboard/invoices/650a4543-ddbe-47fe-bf66-f37906d07ccf/edit?customerId=cc27c14a-0acf-4f4a-a6c9-d45682c144b9&amount=888&status=pending

  // получаем динамические части пути
  const params = await props.params;
  console.log('params', params); // {id: '650a4543-ddbe-47fe-bf66-f37906d07ccf'}

  // получаем то что в пути после ? - параметры поиска - searchParams (здесь - просто посмотреть их)
  const searchParams = await props.searchParams;
  console.log('searchParams', searchParams); // {customerId: 'cc27c14a-0acf-4f4a-a6c9-d45682c144b9', amount: '888', status: 'pending'}

  const id = params.id;

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
