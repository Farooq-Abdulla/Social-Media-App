'use client';

import Posts from "@/components/posts/post";
import PostsLoadingSkeleton from "@/components/posts/posts-skeleton";
import InfiniteScrollContainer from "@/components/ui/infinite-scroll-container";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";


export default function Bookmarks() {
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery<PostsPage>({
        queryKey: ["post-feed", "bookmarks"],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get("/api/posts/bookmarked", pageParam ? { params: { cursor: pageParam } } : {})
            return res.data
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });

    const posts = data?.pages.flatMap(page => page.posts) || []
    if (status === "pending") {
        return <PostsLoadingSkeleton/>;
    }
    if(status==="success" && !posts.length && !hasNextPage){
        return <p className="text-center text-muted-foreground">You don&apos;t have any bookmarks yet.</p>
    }
    if (status === "error") {
        return <p className="text-center text-destructive">An error occured while loading bookmarks.</p>
    }

    return <InfiniteScrollContainer className="space-y-5" onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
        {posts.map(post => (
            <Posts key={post.id} post={post} />
        ))}
        {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
}