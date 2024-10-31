import TrendsSideBar from "@/components/layout/trends-sidebar";
import PostEditor from "@/components/posts/editor/post-editor";
import FollowingFeed from "@/components/posts/following-feed";
import ForYouFeed from "@/components/posts/for-you-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getServerSession from "@/lib/get-server-session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Dashboard"
}
export default async function Dashboard() {
    const session = await getServerSession()
    const user = session?.user
    if (!user) redirect('/api/auth/signin?callbackUrl=/dashboard')
    return (
        <main className=" w-full min-w-0 flex gap-5">
            <div className="w-full min-w-0 space-y-5">
                <PostEditor />
                <Tabs defaultValue="for-you">
                    <TabsList>
                        <TabsTrigger value="for-you">For You</TabsTrigger>
                        <TabsTrigger value="following">Following</TabsTrigger>
                    </TabsList>
                    <TabsContent value="for-you"><ForYouFeed /></TabsContent>
                    <TabsContent value="following"><FollowingFeed /></TabsContent>
                </Tabs>
            </div>
            <TrendsSideBar />
        </main>
    );
}