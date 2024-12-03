import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { to } from "await-to-js";
import { tokenExists } from "./utils";

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
  return NextResponse.json({ data: { token: tokenDoc.token } });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const [deleteError, result] = await to(
    db.collection("tokens").deleteMany({ token })
  );
  if (deleteError) {
    console.error("Error deleting tokens:", deleteError);
    return NextResponse.json(
      { error: "Failed to delete tokens" },
      { status: 500 }
    );
  }

  const deletedCount = result?.deletedCount || 0;

  if (deletedCount === 0) {
    return NextResponse.json({ error: "No tokens deleted" }, { status: 404 });
  }

  return NextResponse.json({
    message: "tokens deleted successfully",
    deletedCount,
  });
}
