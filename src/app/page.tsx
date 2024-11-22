import { db } from "@/lib/mongodb";

export default async function Home() {
  const logs = await db.collection("logs").find({}, { limit: 10 }).toArray();

  console.log(`[logs] `, logs);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <span>logs:</span>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
}
