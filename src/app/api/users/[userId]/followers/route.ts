import getServerSession from '@/lib/get-server-session';
import { prisma } from '@/lib/prisma';
import { FollowerInfo } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
interface IUserIdProps {
  params: {
    userId: string;
  };
}

export async function GET(req:NextRequest,{ params: { userId } }: IUserIdProps) {
  try {
    const session = await getServerSession();
    const loggedInUser = session?.user;
    if (!loggedInUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });
    if (!user)
      return NextResponse.json({ error: 'user not found' }, { status: 404 });

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
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

export async function POST(req:NextRequest,{ params: { userId } }: IUserIdProps) {

  try {
    const session = await getServerSession();
    const loggedInUser = session?.user;
    if (!loggedInUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.follow.upsert({
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

export async function DELETE(req:NextRequest,{ params: { userId } }: IUserIdProps) {
  try {
    const session = await getServerSession();
    const loggedInUser = session?.user;
    if (!loggedInUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.follow.deleteMany({
      where: {
        followerId: loggedInUser.id!,
        followingId: userId,
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
