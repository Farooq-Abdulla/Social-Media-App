'use client';

import PostsLoadingSkeleton from "@/components/posts/posts-skeleton";
import InfiniteScrollContainer from "@/components/ui/infinite-scroll-container";
import { NotificationPage } from "@/lib/types";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import Notification from "./notification";


export default function Notifications() {
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery<NotificationPage>({
        queryKey: ["notifications"],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get("/api/notifications", pageParam ? { params: { cursor: pageParam } } : {})
            return res.data
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });

    const queryClient= useQueryClient();
    const {mutate}= useMutation({
        mutationFn: async ()=> await axios.patch("/api/notifications/marked-as-read"),
        onSuccess:()=> {
            queryClient.setQueryData(["unread-notification-count"], {unreadCount:0})
        },
        onError(error){
            console.error("Failed to mark notifications as read", error);
        }
    })

    useEffect(()=> {
        mutate()
    }, [mutate])

    const notifications = data?.pages.flatMap(page => page.notifications) || []
    if (status === "pending") {
        return <PostsLoadingSkeleton/>;
    }
    if(status==="success" && !notifications.length && !hasNextPage){
        return <p className="text-center text-muted-foreground">You don&apos;t have any notifications yet.</p>
    }
    if (status === "error") {
        return <p className="text-center text-destructive">An error occured while loading notifications.</p>
    }

    return <InfiniteScrollContainer className="space-y-5" onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
        {notifications.map(notification => (
            <Notification key={notification.id!} notification={notification!} />
        ))}
        {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
}