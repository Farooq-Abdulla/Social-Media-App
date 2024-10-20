import getServerSession from '@/lib/get-server-session';
import { prisma } from '@/lib/prisma';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const fileRouter = {
  avatar: f({ image: { maxFileSize: '512KB' } })
    .middleware(async () => {
      const session = await getServerSession();
      const user = session?.user;
      if (!user) throw new UploadThingError('Unauthorized');
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newAvatarUrl = file.url.replace(
        '/f/',
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: { image: newAvatarUrl },
      });
      return { image: newAvatarUrl };
    }),
} satisfies FileRouter;

export type AppFileRoute = typeof fileRouter;
