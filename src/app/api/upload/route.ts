import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Connect this route to the Python backend service for PDF upload handling.
  return NextResponse.json({
    success: true,
    message: "Upload endpoint placeholder ready for Python backend integration.",
  });
}
