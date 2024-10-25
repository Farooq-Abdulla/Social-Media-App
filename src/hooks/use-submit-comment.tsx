import { submitComment } from "@/components/comments/actions";
import { useToast } from "@/hooks/use-toast";
import { CommentsPage } from "@/lib/types";
import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSubmitComment(postId:string) {
    const { toast } = useToast()
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: submitComment,
        onSuccess: async (newComment) => {
            const queryKey:QueryKey=["comments", postId]
            await queryClient.cancelQueries({queryKey})
            queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
                queryKey,
                (oldData) => {
                    const firstPage = oldData?.pages[0]
                    if (firstPage) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    previousCursor: firstPage.previousCursor,
                                    comments: [ ...firstPage.comments, newComment],
                                },
                                ...oldData.pages.slice(1)
                            ]
                        }
                    }
                }

            );
            queryClient.invalidateQueries({
                queryKey,
                predicate(query){
                    return !query.state.data
                }
            })
            toast({
                description:"comment created."
            })
        },
        onError(error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: "Failed to submit comment. Please try again."
            })
        }
    })
    return mutation
}