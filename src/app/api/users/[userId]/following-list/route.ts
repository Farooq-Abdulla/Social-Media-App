import getServerSession from '@/lib/get-server-session';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const users = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        followers: {
          select: {
            follower: {
              select: {
                _count: {
                  select: {
                    followers: true,
                    following: true,
                  },
                },
                displayName: true,
                bio: true,
                id: true,
                image: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
