import { submitPost } from "@/components/posts/editor/actions";
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useSubmitPost() {
    const { toast } = useToast()
    const session = useSession()
    const user = session.data?.user
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: submitPost,
        onMutate: async (variables) => {
            const queryFilter = {
                queryKey: ["post-feed"],
                predicate(query) {
                    return query.queryKey.includes("for-you") ||
                        (query.queryKey.includes("user-posts") && query.queryKey.includes(user?.id))
                }
            } satisfies QueryFilters

            await queryClient.cancelQueries(queryFilter)
            return { queryFilter }
        },
        onSuccess: async (newPost, variables, context) => {
            if (!newPost || !context?.queryFilter) {
                toast({
                    variant: "destructive",
                    description: "Too many attempts. Please wait before posting again."
                })
                return;
            }

            queryClient.setQueriesData<InfiniteData<PostsPage>>(
                context.queryFilter,
                (oldData) => {
                    if (!oldData?.pages[0]) return oldData;

                    return {
                        pageParams: oldData.pageParams,
                        pages: [
                            {
                                posts: [newPost, ...oldData.pages[0].posts],
                                nextCursor: oldData.pages[0].nextCursor
                            },
                            ...oldData.pages.slice(1)
                        ]
                    }
                }
            );


            queryClient.invalidateQueries({
                queryKey: context.queryFilter.queryKey,
                predicate(query) {
                    return context.queryFilter.predicate(query) && !query.state.data
                }
            })

            toast({
                description: "Post created successfully."
            })
        },
        onError: (error, variables, context) => {
            console.error('Post creation error:', error);
            if (error?.name === "Request failed with status code 429") {
                toast({
                    variant: "destructive",
                    description: "Too many attempts. Please wait before posting again."
                })
                return;
            }

            if (context?.queryFilter) {
                queryClient.invalidateQueries(context.queryFilter)
            }

            toast({
                variant: "destructive",
                description: "Failed to create post. Please try again."
            })
        }
    })

    return mutation
}