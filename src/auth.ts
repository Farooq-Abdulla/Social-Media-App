import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import Google from 'next-auth/providers/google';

function getRandomInt(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

const customAdapter = PrismaAdapter(prisma);
customAdapter.createUser = async (user) => {
  const displayName = user.name?.split(' ')[0] || '' + getRandomInt(100, 99999);
  return prisma.user.create({
    data: {
      ...user,
      displayName,
    },
  });
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  theme: {
    logo: '/logo.png',
    colorScheme: 'light',
  },
  adapter: customAdapter as Adapter,
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  providers: [Google],
});
