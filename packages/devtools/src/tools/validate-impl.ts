/**
 * Thin wrapper calling the @okp/validate programmatic API.
 * Kept as a dynamic import so devtools doesn't hard-depend on @okp/validate at build time.
 */
export async function validateImplementation(url: string): Promise<string> {
  try {
    const { validate } = await import('@okp/validate');
    const report = await validate(url);
    return JSON.stringify(report, null, 2);
  } catch {
    return `Could not load @okp/validate. Install it: pnpm add @okp/validate\nURL checked: ${url}`;
  }
}
