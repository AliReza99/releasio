import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { tokenExists } from "../route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const token = (await params).token;

  try {
    const exists = await tokenExists(token);
    if (!exists) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

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
