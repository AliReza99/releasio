import { db } from "@/lib/mongodb";

export default async function Home() {
  const logs = await db.collection("logs").find({}, { limit: 10 }).toArray();

  return (
    <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 gap-4">
      <span>logs:</span>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
}

export const revalidate = 0;
