import TrendsSideBar from "@/components/layout/trends-sidebar"
import { Metadata } from "next"
import SearchResults from "./search-results"

interface PageProps {
    searchParams: { q: string }
}

export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
    return {
        title: `Search results for "${q}"`
    }
}

export default function SearchPage({ searchParams: { q } }: PageProps) {
    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <div className="rounded-2xl bg-card p-5 shadow-lg">
                    <h1 className="text-center text-2xl font-bold line-clamp-2 break-all">Search results for &quot;{q}&quot;</h1>
                </div>
                <SearchResults query={q} />
            </div>
            <TrendsSideBar />
        </main>
    )
}