'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
    Dot,
    LogOut,
    Monitor,
    Moon,
    Sun,
    User
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { memo } from "react";
import UserAvatar from "./user-avatar";


function UserButton({ className }: { className?: string }) {
    const session = useSession()
    const user = session.data?.user
    const { theme, setTheme } = useTheme()
    const queryClient = useQueryClient();
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn("flex-none rounded-full", className)}>
                    <UserAvatar avatarUrl={user?.image!} size={36} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>logged in as @{user?.displayName}</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>

                    <DropdownMenuItem onClick={() => router.push(`/users/${user?.displayName}`)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                    </DropdownMenuItem>

                    {/* <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem> */}


                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Monitor className="mr-2 size-4" />
                            <span>Theme</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    {theme === 'light' && <Dot />}
                                    <Sun className="mr-2 h-4 w-4" />
                                    <span>Light</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    {theme === 'dark' && <Dot />}
                                    <Moon className="mr-2 h-4 w-4" />
                                    <span>Dark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    {theme === 'system' && <Dot />}
                                    <Monitor className="mr-2 h-4 w-4" />
                                    <span>System</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="w-48" onClick={() => {
                    queryClient.clear();
                    signOut({ redirectTo: "/" })
                }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default memo(UserButton);