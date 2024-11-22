import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const token = (await params).token;

  try {
    // Check if token exists in the "tokens" collection
    const tokenExists = await db.collection("tokens").findOne({ token });
    if (!tokenExists) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    // Fetch logs associated with the token from the "logs" collection
    const logs = await db.collection("logs").find({ token }).toArray();

    return NextResponse.json({ data: logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
