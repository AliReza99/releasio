import { NextRequest, NextResponse } from "next/server";

type Handler = (req: NextRequest) => NextResponse | Promise<NextResponse>;

export function withErrorHandling(handler: Handler): Handler {
  return async (req) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("[API Error]:", error);

      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      const stack =
        error instanceof Error && process.env.NODE_ENV === "development"
          ? error.stack
          : null;

      return NextResponse.json({ error: message, stack }, { status: 500 });
    }
  };
}
