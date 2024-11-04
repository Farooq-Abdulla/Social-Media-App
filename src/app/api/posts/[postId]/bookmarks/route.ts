import getServerSession from '@/lib/get-server-session';
import { prisma } from '@/lib/prisma';
import { BookmarkInfo } from '@/lib/types';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
interface IPostIdProps {
  params: {
    postId: string;
  };
}
const bookmarkratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '45s'),
  ephemeralCache: new Map(),
  prefix: '@upstash/ratelimit/bookmark',
  analytics: true,
});

const unbookmarkratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '45s'),
  ephemeralCache: new Map(),
  prefix: '@upstash/ratelimit/un-bookmark',
  analytics: true,
});

export async function GET(
  req: NextRequest,
  { params: { postId } }: IPostIdProps
) {
  try {
    const session = await getServerSession();
    const loggedInUser = session?.user;
    if (!loggedInUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: loggedInUser.id!,
          postId,
        },
      },
    });
    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params: { postId } }: IPostIdProps
) {
  try {
    const session = await getServerSession();
    const loggedInUser = session?.user;
    if (!loggedInUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(
      ','
    )[0];
    const { remaining } = await bookmarkratelimit.limit(ip);
    if (remaining === 0) {
      return NextResponse.json(
        {
          message:
            'You are sending too many requests. Please try again after sometime',
        },
        { status: 429 }
      );
    }

    await prisma.bookmark.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id!,
          postId,
        },
      },
      create: {
        userId: loggedInUser.id!,
        postId,
      },
      update: {},
    });
    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params: { postId } }: IPostIdProps
) {
  try {
    const session = await getServerSession();
    const loggedInUser = session?.user;
    if (!loggedInUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(
      ','
    )[0];
    const { remaining } = await unbookmarkratelimit.limit(ip);
    if (remaining === 0) {
      return NextResponse.json(
        {
          message:
            'You are sending too many requests. Please try again after sometime',
        },
        { status: 429 }
      );
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id!,
        postId,
      },
    });
    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}
