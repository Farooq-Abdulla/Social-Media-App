import TrendsSideBar from "@/components/layout/trends-sidebar";
import PostEditor from "@/components/posts/editor/post-editor";
import ForYouFeed from "@/components/posts/for-you-feed";
import { Metadata } from "next";

export const metaData: Metadata = {
    title: "Dashboard"
}
export default  function Dashboard() {
    return (
        <main className=" w-full min-w-0 flex gap-5">
            <div className="w-full min-w-0 space-y-5">
                <PostEditor/>
                <ForYouFeed/>
            </div>
            <TrendsSideBar/>
        </main>
    );
}