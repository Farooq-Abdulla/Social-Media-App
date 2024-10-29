import TrendsSideBar from "@/components/layout/trends-sidebar";
import getServerSession from "@/lib/get-server-session";
import { Metadata } from "next";
import WhomToFollow from "./whom-to-follow";



export const metadata: Metadata = {
    title: "Who To Follow"
}

export default async function Page() {
    const session = await getServerSession();
    const loggedInUserId = session?.user.id
    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <div className="rounded-2xl bg-card p-5 shadow-lg">
                    <h1 className="text-center text-2xl font-bold">Who To Follow</h1>
                </div>
                <WhomToFollow loggedInUserId={loggedInUserId!} />
            </div>
            <TrendsSideBar />
        </main>
    )
}