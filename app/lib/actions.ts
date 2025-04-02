'use server';
// By adding the 'use server', you mark all the exported functions within the file as Server Actions.
// You can also write Server Actions directly inside Server Components by adding "use server" inside the action. But for this course, we'll keep them all organized in a separate file. We recommend having a separate file for your actions.

import { z } from 'zod';
// define a schema that matches the shape of your form object. This schema will validate the formData before saving it to a database.
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // The amount field is specifically set to coerce (change) from a string to a number while also validating its type.
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

// пропускаем поля id: и date:
const CreateInvoice = FormSchema.omit({ id: true, date: true });

import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Next.js has a client-side router cache that stores the route segments in the user's browser for a time. Along with prefetching, this cache ensures that users can quickly navigate between routes while reducing the number of requests made to the server.
// Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. You can do this with the revalidatePath function from Next.js:

import { revalidatePath } from 'next/cache';

import { redirect } from 'next/navigation';

export async function createInvoice(formData: FormData) {
  // OPT - 1
  // If you're working with forms that have many fields, you may want to consider using the entries() method with JavaScript's Object.fromEntries()
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  // OPT - 2 - better forlarge forms
  //   const rawFormData = Object.fromEntries(formData); // or formData.entries()

  //   console.log(typeof rawFormData.amount);
  // To handle type validation, you have a few options. While you can manually validate types, using a type validation library can save you time and effort. For your example, we'll use Zod, a TypeScript-first validation library that can simplify this task for you.

  console.log(rawFormData);
  const { customerId, amount, status } = CreateInvoice.parse(rawFormData);

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
  // Note how redirect is being called outside of the try/catch block. This is because redirect works by throwing an error, which would be caught by the catch block. To avoid this, you can call redirect after try/catch. redirect would only be reachable if try is successful.
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
        `;
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // for testing error andling by error.tsx
  throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }

  revalidatePath('/dashboard/invoices');
  // Since this action is being called in the /dashboard/invoices path, you don't need to call redirect.
  // Calling revalidatePath will trigger a new server request and re-render the table.
}
