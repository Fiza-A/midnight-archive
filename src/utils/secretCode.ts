/** Whether the built site includes a client-side secret (set NEXT_PUBLIC_SECRET_CODE on Netlify). */
export function hasClientSecretCode(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SECRET_CODE?.trim());
}

/** Client-side verify — works on Netlify when NEXT_PUBLIC_SECRET_CODE is set before build. */
export function verifySecretCodeLocally(input: string): boolean {
  const secret = process.env.NEXT_PUBLIC_SECRET_CODE?.trim();
  if (!secret) return false;
  return input.trim() === secret;
}

export function getSecretCodeSetupHint(): string {
  return "Deployment setup needed: in Netlify add NEXT_PUBLIC_SECRET_CODE = your code, then Deploy site again.";
}

async function verifySecretCodeOnServer(code: string): Promise<{
  valid: boolean;
  notConfigured?: boolean;
}> {
  try {
    const res = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    return {
      valid: Boolean(data.valid),
      notConfigured: data.error === "Secret code not configured",
    };
  } catch {
    return { valid: false };
  }
}

export async function verifySecretCode(code: string): Promise<{
  valid: boolean;
  notConfigured: boolean;
}> {
  if (verifySecretCodeLocally(code)) {
    return { valid: true, notConfigured: false };
  }

  const server = await verifySecretCodeOnServer(code);
  return {
    valid: server.valid,
    notConfigured: Boolean(server.notConfigured) && !hasClientSecretCode(),
  };
}
