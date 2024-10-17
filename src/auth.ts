import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost:true,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  providers: [Google],
});
