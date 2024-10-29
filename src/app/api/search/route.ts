import getServerSession from '@/lib/get-server-session';
import { prisma } from '@/lib/prisma';
import { getPostDataInclude, getUserDataSelect, SearchData } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

const sanitizeSearchQuery = (query: string) => {
  return query.replace(/[@#]/g, '').trim();
};

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q') || '';
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined;
    const sanitized = sanitizeSearchQuery(q);
    const searchQuery = sanitized.split(' ').join(' & ');
    const pageSize = 10;
    const session = await getServerSession();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const [posts, users] = await prisma.$transaction([
      prisma.post.findMany({
        where: {
          OR: [
            { content: { contains: searchQuery, mode: 'insensitive' } },
            {
              user: {
                displayName: { contains: searchQuery, mode: 'insensitive' },
              },
            },
            { user: { name: { contains: searchQuery, mode: 'insensitive' } } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: getPostDataInclude(user.id!),
        take: pageSize + 1,
        cursor: cursor ? { id: cursor } : undefined,
      }),
      prisma.user.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  name: {
                    contains: searchQuery,
                    mode: 'insensitive',
                  },
                },
                { displayName: { contains: searchQuery, mode: 'insensitive' } },
              ],
            },
            {
              following: { none: { followerId: user.id } },
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: getUserDataSelect(user.id!),
      }),
    ]);

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: SearchData = {
      posts: posts.slice(0, pageSize),
      nextCursor: nextCursor,
      users: users,
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
