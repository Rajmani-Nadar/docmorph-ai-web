import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Connect this route to the Python backend pipeline for OCR and Gemini extraction.
  return NextResponse.json({
    success: true,
    message: "Extract endpoint placeholder ready for Python backend integration.",
  });
}
