'use client';
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserAvatar from "../layout/user-avatar";
import PostDotsButton from "./post-dots-button";


export default function Posts({ post }: { post: PostData }) {
    const session = useSession();
    const user= session.data?.user
    return <div className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-lg">
        <div className="flex justify-between gap-3">
            <div className="flex flex-wrap gap-3">
                <Link href={`/users/${post.user.name}`}>
                    <UserAvatar avatarUrl={post.user.image} />
                </Link>
                <div>
                    <Link className="block font-medium hover:underline" href={`/users/${post.user.name}`}>
                        {post.user.displayName}
                    </Link>
                    <Link className="block text-sm text-muted-foreground hover:underline" href={`/posts/${post.id}`}>
                        {formatRelativeDate(new Date(post.createdAt))}
                    </Link>
                </div>
            </div>
            {post.user.id ===user?.id && (
                <PostDotsButton post={post} className="opacity-0 transition-opacity group-hover/post:opacity-100"  />
                )}
        </div>
        <div className="whitespace-pre-line break-words">{post.content}</div>
    </div>
}