'use server';
// By adding the 'use server', you mark all the exported functions within the file as Server Actions.
// You can also write Server Actions directly inside Server Components by adding "use server" inside the action. But for this course, we'll keep them all organized in a separate file. We recommend having a separate file for your actions.

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import { z } from 'zod';
// define a schema that matches the shape of your form object. This schema will validate the formData before saving it to a database.
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.', // add a friendly message if the user doesn't select a customer
  }),
  amount: z.coerce
    .number() // The amount field is specifically set to coerce (change) from a string to a number while also validating its type.
    .gt(0, { message: 'Please enter an amount greater than $0.' }), // Since we are coercing the amount type from string to number, it'll default to zero if the string is empty. Let's tell Zod we always want the amount greater than 0 with the .gt() function.
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.', // add a friendly message if the user doesn't select a status
  }),
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

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // prevState - contains the state passed from the useActionState hook. You won't be using it in the action in this example, but it's a required prop.

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
  const validatedFields = CreateInvoice.safeParse(rawFormData);
  console.log('validatedFields', validatedFields);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;

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

    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
  // Note how redirect is being called outside of the try/catch block. This is because redirect works by throwing an error, which would be caught by the catch block. To avoid this, you can call redirect after try/catch. redirect would only be reachable if try is successful.
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // console.log('validatedFields', validatedFields);

  // without this check we' ll get an errors reading props from validatedFields.data
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update (Edit) Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
        `;
  } catch (error) {
    console.log(error);

    return {
      message: 'Database Error: Failed to Update (Edit) Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  //   // for testing error andling by error.tsx
  //   throw new Error('Failed to Delete Invoice');

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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
