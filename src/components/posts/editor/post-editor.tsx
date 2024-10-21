"use client";

import UserAvatar from "@/components/layout/user-avatar";
import { Button } from "@/components/ui/button";
import useMediaUpload, { Attachment } from "@/hooks/use-media-upload";
import { useSubmitPost } from "@/hooks/use-submit-post";
import { cn } from "@/lib/utils";
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import { ImageIcon, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { memo, useRef } from "react";
import "./styles.css";
function PostEditor() {
    const session = useSession()
    const user = session.data?.user
    const mutation = useSubmitPost()
    const { startUpload, attachments, isUploading, uploadProgress, removeAttachement, reset: resetMediaUploads } = useMediaUpload();

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ bold: false, italic: false }),
            Placeholder.configure({ placeholder: "Spotlight something" })
        ]
    })
    const input = editor?.getText({ blockSeparator: "\n" }) || ""
    function onSubmit() {
        mutation.mutate({
            content: input,
            mediaIds: attachments.map(a => a.mediaId).filter(Boolean) as string[]
        }, {
            onSuccess: () => {
                editor?.commands.clearContent();
                resetMediaUploads();
            }
        })
    }

    return (
        <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-lg ">
            <div className="flex gap-5">
                <UserAvatar avatarUrl={user?.image!} className="hidden sm:inline" />
                <EditorContent editor={editor} className="w-full max-h-[20rem] overflow-y-auto rounded-2xl px-5 py-3 bg-background" />
            </div>
            {!!attachments.length && (
                <AttachmentPreviews attachments={attachments} removeAttachment={removeAttachement} />
            )}
            <div className="flex justify-end gap-3 items-center">
                {isUploading && (
                    <>
                        <span className="text-sm">{uploadProgress ?? 0}%</span>
                        <Loader2 className="size-5 animate-spin text-primary" />
                    </>
                )}
                <AddAttachementsButton onFilesSelected={startUpload} disabled={isUploading || attachments.length >= 5} />
                <Button onClick={onSubmit} disabled={!input.trim() || mutation.isPending || isUploading} className="min-w-20">Post {mutation.isPending && <Loader2 className="size-5 animate-spin" />}</Button>
            </div>
        </div>
    )
}

export default memo(PostEditor);

interface AddAttachementButtonProps {
    onFilesSelected: (file: File[]) => void,
    disabled: boolean
}

function AddAttachementsButton({ onFilesSelected, disabled }: AddAttachementButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    return <>
        <Button variant={"ghost"} size={"icon"} className="text-primary hover:text-primary" disabled={disabled} onClick={() => fileInputRef.current?.click()}><ImageIcon size={20} /></Button>
        <input type="file" accept="image/*, video/*" multiple ref={fileInputRef} className="hidden sr-only" onChange={(e) => {
            const files = Array.from(e.target.files || [])
            if (files.length) {
                onFilesSelected(files)
                e.target.value = ""
            }
        }} />
    </>
}

interface AttachementPreview {
    attachment: Attachment,
    onRemoveClick: () => void
}
interface AttachementPreviewProps {
    attachments: Attachment[],
    removeAttachment: (fileName: string) => void
}

function AttachmentPreviews({ attachments, removeAttachment }: AttachementPreviewProps) {
    return (
        <div className={cn("flex flex-col gap-3", attachments.length > 1 && "sm:grid sm: grid-cols-2")}>
            {attachments.map((attachment) => (
                <AttachmentPreview key={attachment.file.name} attachment={attachment} onRemoveClick={() => removeAttachment(attachment.file.name)} />
            ))}
        </div>
    )
}

function AttachmentPreview({ attachment: { file, mediaId, isUploading }, onRemoveClick }: AttachementPreview) {
    const src = URL.createObjectURL(file);
    return (
        <div className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}>
            {file.type.startsWith("image") ?
                (<Image src={src} alt="Attachement Preview" width={500} height={500} className="size-fit max-h-[30rem] rounded-2xl" />) :
                (<video controls className="size-fit  max-h-[30rem] rounded-2xl">
                    <source src={src} type={file.type} />
                </video>)}
            {!isUploading && (<button onClick={onRemoveClick} className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"><X size={20} /></button>)}
        </div>
    )
}