'use client';

import Posts from "@/components/posts/post";
import PostsLoadingSkeleton from "@/components/posts/posts-skeleton";
import InfiniteScrollContainer from "@/components/ui/infinite-scroll-container";
import { SearchData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { ListOfUsers } from "../users/whoToFollow/list-of-users";

interface SearchResultsProps {
    query: string
}

export default function SearchResults({ query }: SearchResultsProps) {
    const session = useSession()
    const userId = session.data?.user.id
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery<SearchData>({
        queryKey: ["post-feed", "search", query],
        queryFn: async ({ pageParam }) => {
            const params = {
                q: query,
                ...(pageParam ? { cursor: pageParam } : {}),
            }
            const res = await axios.get("/api/search", { params })

            return res.data
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        gcTime: 0
    });

    const posts = data?.pages.flatMap(page => page.posts) || []
    const users = data?.pages.flatMap(page => page.users);
    if (status === "pending") {
        return <PostsLoadingSkeleton />;
    }
    if (status === "success" && !posts.length && !users?.length && !hasNextPage) {
        return <p className="text-center text-muted-foreground">Nothing found for this query</p>
    }
    if (status === "error") {
        return <p className="text-center text-destructive">An error occured while loading.</p>
    }

    return <InfiniteScrollContainer className="space-y-5" onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
        {users?.map(u => <ListOfUsers key={u.id} loggedInUserId={userId!} user={u} />)}
        {posts.map(post => (
            <Posts key={post.id} post={post} />
        ))}
        {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
}