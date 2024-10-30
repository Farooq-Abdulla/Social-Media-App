import TrendsSideBar from "@/components/layout/trends-sidebar";
import PostEditor from "@/components/posts/editor/post-editor";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";
import UserPostsFeed from "./user-posts-feed";

function ProfileTabs({ userId }: { userId: string }) {
    return (
        <main className=" w-full min-w-0 flex gap-5">
            <div className="w-full min-w-0 space-y-5">
                <PostEditor />
                <Tabs defaultValue="posts">
                    <TabsList>
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="followers">Followers</TabsTrigger>
                        <TabsTrigger value="following">Following</TabsTrigger>
                    </TabsList>
                    <TabsContent value="posts"><UserPostsFeed userId={userId} /></TabsContent>
                    <TabsContent value="followers"></TabsContent>
                    <TabsContent value="following"></TabsContent>
                </Tabs>
            </div>
            <TrendsSideBar />
        </main>
    );
}
export default memo(ProfileTabs);