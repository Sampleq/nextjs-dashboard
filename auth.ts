import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    // // WTF???!!! - Failed to fetch user: Error [PostgresError]: relation "users" does not exist
    // const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    // return user[0];

    // just return valid user to go throw tutorial
    return {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@nextmail.com',
      password: '123456',
    };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          // // WTF???!!! - Failed to fetch user: Error [PostgresError]: relation "users" does not exist; Possible smth with AUTH_SECRET and  AUTH_URL fron .env and DB on Vercel
          // const passwordsMatch = await bcrypt.compare(password, user.password);

          // just compare uncrypted passwords to go throw tutorial
          const passwordsMatch = user.password === password;

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ], // The Credentials provider allows users to log in with a username and a password.
});

/**
 
You should be able to log in and out of your application using the following credentials:

Email: user@nextmail.com
Password: 123456

 */
