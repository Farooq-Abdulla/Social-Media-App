import { useToast } from "@/hooks/use-toast";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps{
    postId: string,
    initialState: BookmarkInfo
}

export default function BookmarkButton({postId, initialState}:BookmarkButtonProps){
    const {toast}= useToast()
    const queryClient=useQueryClient()
    const queryKey: QueryKey= ["bookmark-info", postId]

    const {data}= useQuery({
        queryKey,
        queryFn: async()=> {
            const res=await axios.get(`/api/posts/${postId}/bookmarks`)
            return res.data.json() as BookmarkInfo
        },
        initialData: initialState,
        staleTime:Infinity
    })

    const {mutate} = useMutation({
        mutationFn: async()=> data.isBookmarkedByUser? await axios.delete(`/api/posts/${postId}/bookmarks`): await axios.post(`/api/posts/${postId}/bookmarks`),
        onMutate: async ()=> {
            toast({
                description:`Post ${data.isBookmarkedByUser? "un":""}bookmarked`
            })
            await queryClient.cancelQueries({queryKey});
            const previousState= queryClient.getQueryData<BookmarkInfo>(queryKey);
            queryClient.setQueryData<BookmarkInfo>(queryKey, ()=> ({
                isBookmarkedByUser:!previousState?.isBookmarkedByUser
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

    return <button onClick={()=> mutate()} className="flex items-center gap-2">
        <Bookmark className={cn("size-5", data.isBookmarkedByUser&& "fill-primary text-primary")}/>

    </button>

}