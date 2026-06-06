import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const secretCode = process.env.SECRET_CODE ?? "";

    if (!secretCode) {
      return NextResponse.json({ valid: false, error: "Secret code not configured" });
    }

    const normalizedInput = String(code ?? "").trim();
    const normalizedSecret = secretCode.trim();

    if (normalizedInput === normalizedSecret) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
