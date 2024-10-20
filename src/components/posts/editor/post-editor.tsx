"use client";

import UserAvatar from "@/components/layout/user-avatar";
import { Button } from "@/components/ui/button";
import { useSubmitPost } from "@/hooks/use-submit-post";
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { memo } from "react";
import "./styles.css";
function PostEditor(){
    const session=useSession()
    const user=session.data?.user
    const mutation =  useSubmitPost()
    const editor =useEditor({
        extensions:[
            StarterKit.configure({bold:false, italic:false}),
            Placeholder.configure({placeholder:"Spotlight something"})
        ]
    })
    const input=editor?.getText({blockSeparator:"\n"})||""
    function onSubmit() {
        mutation.mutate(input, {
            onSuccess: ()=> {
                editor?.commands.clearContent();
            }
        }) 
    }

    return(
        <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-lg ">
            <div className="flex gap-5">
                <UserAvatar avatarUrl={user?.image!} className="hidden sm:inline"/>
                <EditorContent editor={editor} className="w-full max-h-[20rem] overflow-y-auto rounded-2xl px-5 py-3 bg-background"/>
            </div>
            <div className="flex justify-end">
                <Button onClick={onSubmit}  disabled={!input.trim() || mutation.isPending} className="min-w-20">Post {mutation.isPending && <Loader2 className="size-5 animate-spin" />}</Button>
            </div>
        </div>
    )
}

export default memo(PostEditor);