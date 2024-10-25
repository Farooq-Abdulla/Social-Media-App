import { deleteComment } from "@/components/comments/actions";
import { CommentsPage } from "@/lib/types";
import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export function useDeleteComment() {
    const { toast } = useToast()
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: async (deletedComment) => {
            const queryKey: QueryKey = ["comments", deletedComment.postId]
            await queryClient.cancelQueries({queryKey})
            queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
                queryKey,
                (oldData) => {
                    if (!oldData) return;
                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map(page => ({ 
                            previousCursor: page.previousCursor,
                            comments: page.comments.filter(p => p.id !== deletedComment.id)
                        }))
                    }
                }
            )
            toast({
                description: "Comment deleted."
            })
        },
        onError(error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: "Failed to delete comment. Please try again."
            })
        }
    })
    return mutation
}