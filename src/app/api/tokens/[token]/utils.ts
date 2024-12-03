import { db } from "@/lib/mongodb";

export function tokenExists(token: string) {
  return db.collection("tokens").findOne({ token });
}
