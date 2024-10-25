import { CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Comment from "./comment";
import CommentInput from "./comment-input";

interface CommentsProps{
    post:PostData
}

export default function Comments({post}:CommentsProps){
    const { data, fetchNextPage, hasNextPage, isFetching, status } = useInfiniteQuery<CommentsPage>({
        queryKey: ["comments", post.id],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get(`/api/posts/${post.id}/comments`, pageParam ? { params: { cursor: pageParam } } : {})
            return res.data as CommentsPage
        },
        initialPageParam: null as string | null,
        getNextPageParam: (firstPage) => firstPage.previousCursor,
        select:(data)=>({
            pages:[...data.pages].reverse(),
            pageParams: [...data.pageParams].reverse(),
        })
    });

    const comments = data?.pages.flatMap(page => page.comments) || []
    // if (status === "pending") {
    //     return <PostsLoadingSkeleton/>;
    // }
    // if(status==="success" && !posts.length && !hasNextPage){
    //     return <p className="text-center text-muted-foreground">No one has Posted anything yet</p>
    // }
    // if (status === "error") {
    //     return <p className="text-center text-destructive">An error occured while loading posts</p>
    // }
    return(
        <div className="space-y-3">
            <CommentInput post={post}/>
            {hasNextPage && (<Button variant={'link'} className="mx-auto block" disabled={isFetching} onClick={()=> fetchNextPage()}>Load previous  comments</Button>)}
            {status==="pending" && <Loader2 className="mx-auto animate-spin"/>}
            {status==="success" && !comments.length && <p className="text-muted-foreground text-center">No comments yet.</p>}
            {status==="error" && <p className="text-destructive text-center">An error occured while loading comments.</p>}
            <div className="divide-y">
                {comments.map((comment)=>(
                    <Comment key={comment.id} comment={comment}/>
                ))}
            </div>
        </div>
    )
}