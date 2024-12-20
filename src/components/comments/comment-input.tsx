import { useSubmitComment } from "@/hooks/use-submit-comment";
import { PostData } from "@/lib/types";
import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface CommentInputProps {
    post: PostData
}

export default function CommentInput({ post }: CommentInputProps) {
    const [input, setInput] = useState("")
    const mutation = useSubmitComment(post.id)
    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!input) return;
        mutation.mutate(
            {
                post,
                content: input
            },
            {
                onSuccess: () => setInput("")
            }
        )
    }

    return (
        <form className="flex w-full items-center mt-8 gap-2" onSubmit={onSubmit}>
            <Input placeholder="Write a comment..." value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
            <Button type="submit" variant={'ghost'} size={'icon'} disabled={!input.trim() || mutation.isPending}>
                {!mutation.isPending ? <SendHorizonal /> : <Loader2 className="animate-spin" />}
            </Button>
        </form>
    )
}