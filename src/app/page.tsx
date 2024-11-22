import { Actions } from "./actions";
import { Logs } from "./logs";

export default async function Page() {
  return (
    <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 gap-4">
      <Actions />
      <Logs />
    </div>
  );
}

export const revalidate = 0;
