export default async function Page() {
  // await new Promise<void>(res =>
  await new Promise<void>(res =>
    setTimeout(() => {
      res();
    }, 1000)
  );
  return <p>Customers Page</p>;
}
