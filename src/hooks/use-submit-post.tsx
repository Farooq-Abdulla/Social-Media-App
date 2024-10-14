import { submitPost } from "@/components/posts/editor/actions";
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSubmitPost() {
    const { toast } = useToast()
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: submitPost,
        onSuccess: async (newPost) => {
            // queryClient.invalidateQueries({queryKey:["post-feed", "for-you"]})
            await queryClient.cancelQueries({ queryKey: ["post-feed", "for-you"] })
            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                { queryKey: ["post-feed", "for-you"] },
                (oldData) => {
                    const firstPage = oldData?.pages[0]
                    if (firstPage) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    posts: [newPost, ...firstPage.posts],
                                    nextCursor: firstPage.nextCursor
                                },
                                ...oldData.pages.slice(1)
                            ]
                        }
                    }
                }

            );
            queryClient.invalidateQueries({
                queryKey:["post-feed", "for-you"],
                predicate(query){
                    return !query.state.data
                }
            })
            toast({
                description:"Post created."
            })
        },
        onError(error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: "Failed to post. Please try again."
            })
        }
    })
    return mutation
}