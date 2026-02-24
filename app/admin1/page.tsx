async function getTotalBalance() {
  const res = await fetch(
    "https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account",
    { cache: "no-store" }
  );

  const accounts = await res.json();

  return accounts.reduce(
    (sum: number, acc: any) => sum + Number(acc.balance || 0),
    0
  );
}

export default async function Admin1Page() {
  const total = await getTotalBalance();

  return (
    <main style={{ padding: 20 }}>
      <h1>Admin1</h1>
      <p>Welcome to the Admin1 landing page.</p>

      <h2 style={{ marginTop: 20 }}>Total Money In Bank</h2>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>
        ${total.toLocaleString()}
      </p>
    </main>
  );
}