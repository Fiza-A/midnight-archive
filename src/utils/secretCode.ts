/** Client-side fallback when server env is missing (e.g. Netlify misconfiguration). */
export function verifySecretCodeLocally(input: string): boolean {
  const secret = process.env.NEXT_PUBLIC_SECRET_CODE?.trim();
  if (!secret) return false;
  return input.trim() === secret;
}

export function getSecretCodeSetupHint(): string {
  return "Set SECRET_CODE in Netlify → Site configuration → Environment variables, then trigger a new deploy.";
}
