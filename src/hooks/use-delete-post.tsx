import { deletePost } from "@/components/posts/delete-actions";
import { PostsPage } from "@/lib/types";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "./use-toast";

export function useDeletePost() {
    const { toast } = useToast()
    const queryClient = useQueryClient();
    const router = useRouter()
    const pathname = usePathname()

    const mutation = useMutation({
        mutationFn: deletePost,
        onMutate: async () => {
            const queryFilter: QueryFilters = { queryKey: ["post-feed"] }
            await queryClient.cancelQueries(queryFilter)
            return { queryFilter }
        },
        onSuccess: async (deletedPost, variables, context) => {
            if (!deletedPost || !context.queryFilter) {
                toast({
                    variant: "destructive",
                    description: "Too many attempts. Please wait before deleting again."
                })
                return;
            }
            // const queryFilter: QueryFilters = { queryKey: ["post-feed"] }
            // await queryClient.cancelQueries(queryFilter)
            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                context.queryFilter,
                (oldData) => {
                    if (!oldData) return;
                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map(page => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.filter(p => p.id !== deletedPost.id)
                        }))
                    }
                }
            )
            toast({
                description: "Post deleted."
            })
            if (pathname === `/posts/${deletedPost.id}`) {
                router.push(`/users/${deletedPost.user.displayName}`);
            }
        },
        onError(error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: "Failed to delete post. Please try again."
            })
        }
    })
    return mutation
}