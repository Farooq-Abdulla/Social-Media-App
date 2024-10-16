'use client';
import useFollowerInfo from "@/hooks/use-follower";
import { useToast } from "@/hooks/use-toast";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "./button";

interface FollowButtonProps{
    userId: string,
    initialState: FollowerInfo
}
export default function FollowButton({userId, initialState}:FollowButtonProps){
    const {toast}= useToast()
    const queryClient=useQueryClient()
    const {data}= useFollowerInfo(userId, initialState)
    const queryKey:QueryKey= ["follower-info", userId]
    const {mutate}= useMutation({
        mutationFn: async()=> data.isFollowedByUser? await axios.delete(`/api/users/${userId}/followers`): await axios.post(`/api/users/${userId}/followers`),
        onMutate: async ()=> {
            await queryClient.cancelQueries({queryKey});
            const previousState= queryClient.getQueryData<FollowerInfo>(queryKey);
            queryClient.setQueryData<FollowerInfo>(queryKey, ()=> ({
                followers:(previousState?.followers||0)+(previousState?.isFollowedByUser ? -1 : 1),
                isFollowedByUser:!previousState?.isFollowedByUser
            }))

            return {previousState};
        },
        onError(error,variables, context){
            queryClient.setQueryData(queryKey, context?.previousState )
            console.error(error)
            toast({
                variant:"destructive",
                description:"Something went wrong. Please try again."
            })
        }
    })
    return (
        <Button variant={data.isFollowedByUser ? "secondary":"default"} onClick={()=> mutate()}>
            {data.isFollowedByUser? "Unfollow":"Follow"}
        </Button>
    )
} 