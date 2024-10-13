'use client';

import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "../ui/infinite-scroll-container";
import Posts from "./post";

export default function ForYouFeed() {
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery<PostsPage>({
        queryKey: ["post-feed", "for-you"],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get("/api/posts/for-you", pageParam ? { params: { cursor: pageParam } } : {})
            return res.data
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });

    const posts = data?.pages.flatMap(page => page.posts) || []
    if (status === "pending") {
        return <Loader2 className="mx-auto animate-spin" />
    }
    if (status === "error") {
        return <p className="text-center text-destructive">An error occured while loading posts</p>
    }

    return <InfiniteScrollContainer className="space-y-5" onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
        {posts.map(post => (
            <Posts key={post.id} post={post} />
        ))}
        {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
}