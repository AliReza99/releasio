import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { tokenExists } from "../utils";
import { to } from "await-to-js";
import type {
  Log,
  LogPayload,
} from "../../../../../../packages/releaseio/src/types";

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

    const logs = await db
      .collection("logs")
      .find({ token })
      .sort({ _id: -1 }) // Sort in descending order, use 1 for ascending
      .toArray();

    return NextResponse.json({ data: logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const body = (await request.json()) as LogPayload;
  const [tokenError, tokenDoc] = await to(
    db.collection("tokens").findOne({ token })
  );
  if (tokenError) {
    console.error("Error checking token:", tokenError);
    return NextResponse.json(
      { error: "Failed to check token" },
      { status: 500 }
    );
  }

  if (!tokenDoc) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  const log: Omit<Log, "_id"> = {
    date: new Date().toISOString(),
    token,
    version: body.version,
    commit: body.commit,
    changes: body.changes,
  };

  const [logError] = await to(db.collection("logs").insertOne(log));
  if (logError) {
    console.error("Error adding log:", logError);
    return NextResponse.json({ error: "Failed to add log" }, { status: 500 });
  }

  return NextResponse.json({ message: "Log added successfully", data: log });
}
