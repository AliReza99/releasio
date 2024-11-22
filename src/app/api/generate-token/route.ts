import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/mongodb";

export async function POST() {
  try {
    const token = uuidv4();

    const collection = db.collection("tokens");

    await collection.insertOne({ token, createdAt: new Date() });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

