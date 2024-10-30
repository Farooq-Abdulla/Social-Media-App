'use client';

import PostsLoadingSkeleton from "@/components/posts/posts-skeleton";
import InfiniteScrollContainer from "@/components/ui/infinite-scroll-container";
import { WhomToFollowData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { ListOfUsers } from "./list-of-users";


export default function WhomToFollow({ loggedInUserId }: { loggedInUserId: string }) {
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery<WhomToFollowData>({
        queryKey: ["list-of-users", loggedInUserId],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get("/api/users/who-to-follow", pageParam ? { params: { cursor: pageParam } } : {})
            return res.data
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });

    const users = data?.pages.flatMap(page => page.users) || []
    if (status === "pending") {
        return <PostsLoadingSkeleton />;
    }
    if (status === "success" && !users.length && !hasNextPage) {
        return <p className="text-center text-muted-foreground">You don&apos;t have any bookmarks yet.</p>
    }
    if (status === "error") {
        return <p className="text-center text-destructive">An error occured while loading Users.</p>
    }

    return <InfiniteScrollContainer className="space-y-5" onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
        {users.map((user) => <ListOfUsers key={user.id} user={user} loggedInUserId={loggedInUserId} />)}
        {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
}