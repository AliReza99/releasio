import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { to } from "await-to-js";
import type { Log } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string; logId: string }> }
) {
  const { token, logId } = await params;

  try {
    const log = await db
      .collection("logs")
      .findOne({ token, _id: new ObjectId(logId) });

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    return NextResponse.json({ data: log });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ token: string; logId: string }> }
) {
  const { token, logId } = await params;

  const body = (await request.json()) as Pick<Log, "version" | "changes">;
  const [updateError, result] = await to(
    db.collection("logs").updateOne(
      { token: token, _id: new ObjectId(logId) },
      {
        $set: {
          ...(body.version && { version: body.version }),
          ...(body.changes && { changes: body.changes }),
        },
      }
    )
  );

  if (updateError) {
    console.error(
      "Error updating log:",
      updateError || "No document matched the filter"
    );
    return NextResponse.json(
      {
        error:
          "Failed to update log " + updateError ||
          "No document matched the filter",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Log updated successfully",
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ token: string; logId: string }> }
) {
  const { token, logId } = await params;

  const [deleteError, result] = await to(
    db.collection("logs").deleteMany({ token, _id: new ObjectId(logId) })
  );
  if (deleteError) {
    console.error("Error deleting logs:", deleteError);
    return NextResponse.json(
      { error: "Failed to delete logs" },
      { status: 500 }
    );
  }

  const deletedCount = result?.deletedCount || 0;

  if (deletedCount === 0) {
    return NextResponse.json({ error: "No logs deleted" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Logs deleted successfully",
    deletedCount,
  });
}
