import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Connect this route to the Python backend for Excel and CSV export generation.
  return NextResponse.json({
    success: true,
    message: "Export endpoint placeholder ready for Python backend integration.",
  });
}
