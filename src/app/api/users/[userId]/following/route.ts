import getServerSession from '@/lib/get-server-session';
import { prisma } from '@/lib/prisma';
import { FollowingInfo } from '@/lib/types';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
interface IUserIdProps {
  params: {
    userId: string;
  };
}

const followingratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(40, '60s'),
  ephemeralCache: new Map(),
  prefix: '@upstash/ratelimit/following',
  analytics: true,
});
const unfollowingratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(40, '60s'),
  ephemeralCache: new Map(),
  prefix: '@upstash/ratelimit/un-following',
  analytics: true,
});
export async function GET(
  req: NextRequest,
  { params: { userId } }: IUserIdProps
) {
  try {
    const session = await getServerSession();
    const loggedInUser = session?.user;
    if (!loggedInUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        _count: {
          select: {
            following: true,
          },
        },
      },
    });
    if (!user)
      return NextResponse.json({ error: 'user not found' }, { status: 404 });

    const data: FollowingInfo = {
      following: user._count.following,
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
  { params: { userId } }: IUserIdProps
) {
  try {
    const session = await getServerSession();
    const loggedInUser = session?.user;
    if (!loggedInUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(
      ','
    )[0];
    const { remaining } = await followingratelimit.limit(ip);
    if (remaining === 0) {
      return NextResponse.json(
        {
          message:
            'You are sending too many requests. Please try again after sometime',
        },
        { status: 429 }
      );
    }

    await prisma.$transaction([
      prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: loggedInUser.id!,
            followingId: userId,
          },
        },
        create: {
          followerId: loggedInUser.id!,
          followingId: userId,
        },
        update: {},
      }),
      prisma.notification.create({
        data: {
          issuerId: loggedInUser.id!,
          recipientId: userId,
          type: 'FOLLOW',
        },
      }),
    ]);

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
  { params: { userId } }: IUserIdProps
) {
  try {
    const session = await getServerSession();
    const loggedInUser = session?.user;
    if (!loggedInUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(
      ','
    )[0];
    const { remaining } = await unfollowingratelimit.limit(ip);
    if (remaining === 0) {
      return NextResponse.json(
        {
          message:
            'You are sending too many requests. Please try again after sometime',
        },
        { status: 429 }
      );
    }

    await prisma.$transaction([
      prisma.follow.deleteMany({
        where: {
          followerId: loggedInUser.id!,
          followingId: userId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id!,
          recipientId: userId,
          type: 'FOLLOW',
        },
      }),
    ]);

    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}
