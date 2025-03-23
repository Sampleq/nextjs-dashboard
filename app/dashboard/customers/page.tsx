export default async function Page() {
  // await new Promise<void>(res =>
  await new Promise<void>(res =>
    setTimeout(() => {
      res();
    }, 100)
  );
  return <p>Customers Page</p>;
}
