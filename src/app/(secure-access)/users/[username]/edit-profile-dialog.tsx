'use client';
import { Button } from "@/components/ui/button";
import CropImageDialog from "@/components/ui/crop-image-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfile } from "@/hooks/use-update-user";
import { UserData } from "@/lib/types";
import { updateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";


interface EditProfileDialogProps {
    user: UserData,
    open: boolean,
    onOpenChange: (open: boolean) => void
}

export default function EditProfileDialog({ user, open, onOpenChange }: EditProfileDialogProps) {
    const form = useForm<UpdateUserProfileValues>({
        resolver: zodResolver(updateUserProfileSchema),
        defaultValues: {
            displayName: user.displayName || "",
            bio: user.bio || ""
        }
    })

    const mutation = useUpdateProfile();
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
    async function onSubmit(values: UpdateUserProfileValues) {
        const newAvatarFile=croppedImage? new File([croppedImage], `avatar_${user.id}.webp`): undefined
        mutation.mutate(
            {
                values,
                avatar: newAvatarFile
            },
            {
                onSuccess: () => {
                    setCroppedImage(null)
                    onOpenChange(false)
                }
            }
        )
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-1.5">
                    <Label>Profile Pic</Label>
                    <AvatarInput src={croppedImage ? URL.createObjectURL(croppedImage) : user.image || '/avatarPlaceholder.png'} onImageCropped={setCroppedImage} />
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your display name" {...field}></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us about yourself" className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={mutation.isPending}>Save {mutation.isPending && <Loader2 className="mx-auto animate-spin" />}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

interface AvatarInputProps {
    src: string | StaticImageData;
    onImageCropped: (blob: Blob | null) => void
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
    const [imageToCrop, setImageToCrop] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement>(null)
    function onImageSelected(image: File | undefined) {
        if (!image) return
        Resizer.imageFileResizer(image, 1024, 1024, "WEBP", 100, 0, (uri)=>setImageToCrop(uri as File), "file")
    }
    return <>
        <input type="file" accept="image/*" onChange={(e) => onImageSelected(e.target.files?.[0])} ref={fileInputRef} className="hidden sr-only" />
        <button type="button" className="group relative block" onClick={() => fileInputRef.current?.click()}>
            <Image src={src} alt="Image Preview" width={150} height={150} className="size-32 flex-none rounded-full object-cover" />
            <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-45"><Camera size={24} /></span>
        </button>
        {imageToCrop && (<CropImageDialog src={URL.createObjectURL(imageToCrop)} cropAspectRatio={1} onCropped={onImageCropped} onClose={() => {
            setImageToCrop(undefined)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }} />)}
    </>
}