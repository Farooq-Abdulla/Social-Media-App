import { updateUserProfile } from "@/app/(secure-access)/users/[username]/actions";
import { PostsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validations";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";

export function useUpdateProfile() {
    const { toast } = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { startUpload: startAvatarUpload } = useUploadThing("avatar");

    const mutation = useMutation({
        mutationFn: async ({ values, avatar }: { values: UpdateUserProfileValues, avatar?: File }) => {
            return Promise.all([
                updateUserProfile(values),
                avatar && startAvatarUpload([avatar])
            ])
        },
        onSuccess: async ([updatedUser, uploadResult]) => {
            const newAvatarUrl = uploadResult?.[0].serverData.image;
            const queryFilter: QueryFilters = { queryKey: ["post-feed"] };
            await queryClient.cancelQueries(queryFilter);
            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                queryFilter,
                (oldData) => {
                    if (!oldData) return
                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map(page => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.map(post => {
                                if (post.user.id === updatedUser.id) {
                                    return {
                                        ...post,
                                        user: {
                                            ...updatedUser,
                                            image: newAvatarUrl || updatedUser.image
                                        },
                                    }
                                }
                                return post
                            })
                        }))
                    }
                }
            )
            router.refresh()
            toast({
                description: "Profile Updated"
            })
        },
        onError(error){
            console.error(error);
            toast({
                variant:"destructive",
                description: "Failed to update profile. Please try again."
            })
        }
    })

    return mutation
}