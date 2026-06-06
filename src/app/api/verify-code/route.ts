import { NextRequest, NextResponse } from "next/server";

function getSecretCode(): string {
  return (process.env.SECRET_CODE ?? process.env.NEXT_PUBLIC_SECRET_CODE ?? "").trim();
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const secretCode = getSecretCode();

    if (!secretCode) {
      return NextResponse.json({
        valid: false,
        error: "Secret code not configured",
      });
    }

    const normalizedInput = String(code ?? "").trim();

    if (normalizedInput === secretCode) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
