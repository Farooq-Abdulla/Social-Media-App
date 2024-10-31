import TrendsSideBar from "@/components/layout/trends-sidebar";
import getServerSession from "@/lib/get-server-session";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Notifications from "./notifications";


export const metadata: Metadata = {
    title: "Notifications"
}

export default async function Page() {
    const session = await getServerSession()
    const user = session?.user
    if (!user) redirect('/api/auth/signin?callbackUrl=/notifications')
    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <div className="rounded-2xl bg-card p-5 shadow-lg">
                    <h1 className="text-center text-2xl font-bold">Notifications</h1>
                </div>
                <Notifications />
            </div>
            <TrendsSideBar />
        </main>
    )
}