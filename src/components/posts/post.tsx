'use client';
import { config } from "@/lib/config";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Comments from "../comments/comments";
import UserAvatar from "../layout/user-avatar";
import Linkify from "../ui/linkify";
import UserTooltip from "../ui/user-tooltip";
import BookmarkButton from "./bookmark-button";
import { ShareButton } from "./editor/share-button";
import LikeButton from "./like-button";
import PostDotsButton from "./post-dots-button";


export default function Posts({ post }: { post: PostData }) {

    const [showComments, setShowComments] = useState(false);
    const session = useSession();
    const user = session.data?.user
    return <div className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-lg">
        <div className="flex justify-between gap-3">
            <div className="flex flex-wrap gap-3">
                <UserTooltip user={post.user}>
                    <Link href={`/users/${post.user.displayName}`}>
                        <UserAvatar avatarUrl={post.user.image} />
                    </Link>
                </UserTooltip>

                <div>
                    <UserTooltip user={post.user}>
                        <Link className="block font-medium hover:underline" href={`/users/${post.user.displayName}`}>
                            {post.user.displayName}
                        </Link>
                    </UserTooltip>
                    <Link className="block text-sm text-muted-foreground hover:underline" href={`/posts/${post.id}`} suppressHydrationWarning>
                        {formatRelativeDate(new Date(post.createdAt))}
                    </Link>
                </div>
            </div>
            {post.user.id === user?.id && (
                <PostDotsButton post={post} className="opacity-0 transition-opacity group-hover/post:opacity-100" />
            )}
        </div>
        <Linkify>
            <div className="whitespace-pre-line break-words">{post.content}</div>
        </Linkify>
        {!!post.attachments.length && (
            <MediaPreviews attachements={post.attachments} />
        )}
        <hr className="text-muted-foreground" />
        <div className="flex justify-between gap-5">
            <div className="flex items-center gap-5">
                <LikeButton postId={post.id} initialState={{
                    likes: post._count.likes,
                    isLikedByUser: post.likes.some((like) => like.userId === user?.id)
                }}
                />
                <CommentsButton post={post} onClick={() => setShowComments(!showComments)} />
                <ShareButton linkToCopy={`${config.url}/posts/${post.id}`} />
            </div>
            <BookmarkButton postId={post.id} initialState={{
                isBookmarkedByUser: post.bookmarks.some(bookmark => bookmark.userId === user?.id)
            }} />
        </div>
        {showComments && <Comments post={post} />}
    </div>
}

interface MediaPreviewsPops {
    attachements: Media[]
}

function MediaPreviews({ attachements }: MediaPreviewsPops) {

    return <div className={cn("flex flex-col gap-3", attachements.length > 1 && "sm:grid sm:grid-cols-2")}>
        {attachements.map(m => (
            <MediaPreview key={m.id} media={m} />
        ))}
    </div>
}

interface MediaPreviewProps {
    media: Media
}

function MediaPreview({ media }: MediaPreviewProps) {
    if (media.type === "IMAGE") {
        return <Image src={media.url} alt="Attachment" width={500} height={500} className="mx-auto size-fit max-h-[30rem] rounded-2xl" />
    }
    if (media.type === "VIDEO") {
        return (
            <div>
                <video controls src={media.url} className="mx-auto size-fit max-h-[30rem] rounded-2xl" />
            </div>
        )
    }
    return <p className="text-destructive">Unsupported meida type</p>
}

interface CommentButtonProps {
    post: PostData,
    onClick: () => void
}

function CommentsButton({ post, onClick }: CommentButtonProps) {
    return (
        <button className="flex items-center gap-2" onClick={onClick}>
            <MessageSquare className="size-5" />
            <span className="text-sm font-medium tabular-nums">
                {post._count.comments}{" "}
                <span className="hidden sm:inline">comments</span>
            </span>
        </button>
    )
}