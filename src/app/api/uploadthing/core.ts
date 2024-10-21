import getServerSession from '@/lib/get-server-session';
import { prisma } from '@/lib/prisma';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError, UTApi } from 'uploadthing/server';

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
      const oldAvatarUrl = metadata.user.image;
      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        )[1];
        await new UTApi().deleteFiles(key);
      }
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
  attachment: f({
    image: { maxFileSize: '4MB', maxFileCount: 5 },
    video: { maxFileSize: '64MB', maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await getServerSession();
      const user = session?.user;
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.url.replace(
            '/f/',
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
          ),
          type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO',
        },
      });
      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRoute = typeof fileRouter;
