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

export default async function Page() {
  const total = await getTotalBalance();

  return (
    <main style={{ padding: 20 }}>
      <h1>Total Money In Bank</h1>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>
        ${total.toLocaleString()}
      </p>
    </main>
  );
}