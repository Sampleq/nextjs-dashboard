'use server';

import bcrypt from 'bcryptjs';

import postgres from 'postgres';
import { CustomerField, User } from '@/app/lib/definitions';

import { users as usersFromFile } from '@/app/lib/placeholder-data';
const user = usersFromFile[0];
/**
 * igor@mail.com - 777pass
 * dmitriy@mail.com - 123123
 * dmitriy.s@mail.com - 123123
 */

// https://www.uuidgenerator.net/

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function formAction() {
  console.log('my test form');

  //   export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
        SELECT
          id,
          name
        FROM customers
        ORDER BY name ASC
      `;

    console.log('customers[0]', customers[0]);
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }

  // Seed SQL DB with users TABLE and put user (user@nextmail.com) from placeholder-data.ts to it
  try {
    /* // Worked fine

    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`   ----  finish to create TABLE users`);

    */

    const hashedPassword = await bcrypt.hash('123123', 10);

    /*
    INSERT INTO users (id, name, email, password)
    VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password})
    ON CONFLICT (id) DO NOTHING;
    */

    await sql`INSERT INTO users (id, name, email, password)
    VALUES (${`154cc5af-1a7b-4984-b068-1064d468598c`}, ${'Dmitriy'}, ${'dmitriy.s@mail.com'}, ${hashedPassword})
    ON CONFLICT (id) DO NOTHING
  `;

    // const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    const users = await sql<User[]>`SELECT * FROM users`;

    console.log('users', users);
  } catch (error) {
    console.error('Database Error:', error);
    console.log('Failed to fetch sql`SELECT * FROM users`');
    throw new Error('Failed to fetch sql`SELECT * FROM users`');
  }
}
