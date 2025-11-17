import { cookies } from 'next/headers';

export async function getLocale(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('NEXT_LOCALE')?.value || 'en-US';
  } catch {
    return 'en-US';
  }
}
