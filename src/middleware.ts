import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, '60s'),
  prefix: '@upstash/ratelimit/related-post',
});

export async function middleware(req: NextRequest) {
  if (req.method === 'POST' && req.nextUrl.pathname === '/dashboard') {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const { success, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          message: 'You are sending too many requests. Please try again later.',
        },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};
