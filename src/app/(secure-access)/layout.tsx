import Menubar from "@/components/layout/menubar";
import NavBar from "@/components/layout/navbar";
import getServerSession from "@/lib/get-server-session";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function SecureAccessLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session= await getServerSession()
    if(!session?.user) redirect("/")
    return (
        <SessionProvider session={session}>
        <div>
            <div className="flex flex-col min-h-screen">
                <NavBar />
                <div className="mx-auto p-5 max-w-7xl flex w-full grow gap-5 ">
                    <Menubar className="sticky top-[5.25rem] h-fit hidden sm:block flex-none space-y-3 rounded-2xl dark:bg-[#161616] dark:text-[#f5f5f5] bg-white text-gray-900 px-3 py-5 lg:px-5 shadow-lg  xl:w-80" />
                    {children}
                </div>
                <Menubar className="sticky bottom-0 flex w-full justify-center gap-5 border-t dark:bg-[#161616] dark:text-[#f5f5f5] bg-white text-gray-900 p-3 sm:hidden " />
            </div>
        </div>
        </SessionProvider>
    );
}
