import getServerSession from '@/lib/get-server-session';
import { prisma } from '@/lib/prisma';
import { getUserDataSelect, WhomToFollowData } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined;
    const pageSize = 10;
    const session = await getServerSession();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const users = await prisma.user.findMany({
      where: {
        id: { not: user.id },
        followers: {
          none: {
            followerId: user.id,
          },
        },
      },
      select: getUserDataSelect(user.id!),
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = users.length > pageSize ? users[pageSize].id : null;

    const data: WhomToFollowData = {
      users: users.slice(0, pageSize),
      nextCursor: nextCursor,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
