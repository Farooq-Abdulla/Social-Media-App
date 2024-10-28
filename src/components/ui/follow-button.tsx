'use client';
import useFollowerInfo from "@/hooks/use-follower";
import { useToast } from "@/hooks/use-toast";
import { FollowerInfo, FollowingInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "./button";

interface FollowButtonProps {
    userId: string,
    initialState: FollowerInfo
}
export default function FollowButton({ userId, initialState }: FollowButtonProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const pathname = usePathname()
    const session = useSession();
    const loggedInUser = session.data?.user;
    const displayName = loggedInUser?.displayName as string
    const { data } = useFollowerInfo(userId, initialState)
    const queryKey: QueryKey = ["follower-info", userId]
    const followingQueryKey: QueryKey = ["following-info", loggedInUser?.id]
    const { mutate } = useMutation({
        mutationFn: async () => data.isFollowedByUser ? await axios.delete(`/api/users/${userId}/followers`) : await axios.post(`/api/users/${userId}/followers`),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey });
            const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);
            queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
                followers: (previousState?.followers || 0) + (previousState?.isFollowedByUser ? -1 : 1),
                isFollowedByUser: !previousState?.isFollowedByUser
            }))

            await queryClient.cancelQueries({ queryKey: followingQueryKey });
            const followingPreviousState = queryClient.getQueryData<FollowingInfo>(followingQueryKey);
            if (pathname.includes(displayName)) {
                queryClient.setQueryData<FollowingInfo>(followingQueryKey, () => ({
                    following: data.isFollowedByUser ? (followingPreviousState?.following || 0) - 1 : (followingPreviousState?.following || 0) + 1
                }))
            }

            return { previousState, followingPreviousState };
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState)
            queryClient.setQueryData(followingQueryKey, context?.followingPreviousState)
            console.error(error)
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again."
            })
        }
    })
    return (
        <Button variant={data.isFollowedByUser ? "secondary" : "default"} onClick={() => mutate()}>
            {data.isFollowedByUser ? "Unfollow" : "Follow"}
        </Button>
    )
} 