'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfile } from "@/hooks/use-update-user";
import { UserData } from "@/lib/types";
import { updateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

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
    async function onSubmit(values: UpdateUserProfileValues) {
        mutation.mutate(
            {
                values,
            },
            {
                onSuccess: () => {
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