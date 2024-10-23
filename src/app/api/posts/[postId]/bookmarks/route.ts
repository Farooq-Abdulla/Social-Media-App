import getServerSession from '@/lib/get-server-session';
import { prisma } from '@/lib/prisma';
import { BookmarkInfo } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
interface IPostIdProps {
  params: {
    postId: string;
  };
}

export async function GET(
  req: NextRequest,
  { params: { postId } }: IPostIdProps
) {
  try {
    const session = await getServerSession();
    const loggedInUser = session?.user;
    if (!loggedInUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const bookmark= await prisma.bookmark.findUnique({
        where:{
            userId_postId:{
                userId: loggedInUser.id!,
                postId
            }
        }
    })
    const data:BookmarkInfo={
        isBookmarkedByUser: !!bookmark
    }

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
