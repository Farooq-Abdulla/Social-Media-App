"use client"


import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormEvent, memo, useCallback, useEffect, useRef, useState } from "react"
import { Input } from "./ui/input"

function SearchField() {

    const inputRef = useRef<HTMLInputElement>(null)
    const [isFocused, setIsFocused] = useState(false);


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                inputRef.current?.focus()
            }
            if (e.key === "Escape") {
                e.preventDefault()
                inputRef.current?.blur()
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const router = useRouter();
    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const q = (form.q as HTMLInputElement).value.trim();
        if (!q) return;
        router.push(`/search?q=${encodeURIComponent(q)}`)
    }, [router])

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };


    return <form action="/search" onSubmit={handleSubmit}>
        <div className="cursor-text relative">
            <Input
                ref={inputRef}
                name="q"
                placeholder="Search"
                className="pl-8 pr-4 rounded-xl"
                onFocus={handleFocus}
                onBlur={handleBlur}
            />

            {!isFocused && (
                <kbd
                    className={`pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 absolute right-4 top-1/2 transform -translate-y-1/2`}
                >
                    <span className="text-xs">⌘</span>K
                </kbd>
            )}

            <SearchIcon className="absolute left-2 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
        </div>
    </form>
}

export default memo(SearchField);