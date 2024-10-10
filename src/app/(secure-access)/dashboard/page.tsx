import TrendsSideBar from "@/components/layout/trends-sidebar";
import PostEditor from "@/components/posts/editor/post-editor";
import Posts from "@/components/posts/post";
import { prisma } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { Metadata } from "next";

export const metaData: Metadata = {
    title: "Dashboard"
}
export default async function Dashboard() {
    const posts= await prisma.post.findMany({
        orderBy:{createdAt:"desc"},
        include:postDataInclude
    })
    return (
        <main className=" w-full min-w-0 flex gap-5">
            <div className="w-full min-w-0 space-y-5">
                <PostEditor/>
                {posts.map(post=>(
                    <Posts key={post.id} post={post}/>
                ))}
            </div>
            <TrendsSideBar/>
        </main>
    );
}