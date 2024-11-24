import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { to } from "await-to-js";

export function tokenExists(token: string) {
  return db.collection("tokens").findOne({ token });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const [error, tokenDoc] = await to(tokenExists(token));

  if (error) {
    console.error("Error resolving token:", error);
    return NextResponse.json(
      { error: "Failed to resolve token" },
      { status: 500 }
    );
  }

  if (!tokenDoc) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  // Return the token details
  return NextResponse.json({ token: tokenDoc.token });
}
