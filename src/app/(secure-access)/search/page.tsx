import TrendsSideBar, { TrendingTopics } from "@/components/layout/trends-sidebar"
import getServerSession from "@/lib/get-server-session"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import SearchResults from "./search-results"

interface PageProps {
    searchParams: { q: string }
}

export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
    return {
        title: `Search results for "${q === undefined ? "Trending Topics" : q}"`
    }
}

export default async function SearchPage({ searchParams: { q } }: PageProps) {
    const session = await getServerSession()
    const user = session?.user
    if (!user) { q === undefined ? redirect(`/api/auth/signin?callbackUrl=/search`) : redirect(`/api/auth/signin?callbackUrl=/search?q=${q}`) }
    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <div className="rounded-2xl bg-card p-5 shadow-lg">
                    {q === '' ? <h1 className="text-center text-2xl font-bold line-clamp-2 break-all">You don&apos;t have query</h1> : (q === undefined ? <h1 className="text-center text-xl lg:text-2xl font-bold line-clamp-1 break-all">What&apos;s Trending</h1> : <h1 className="text-center text-xl lg:text-2xl font-bold line-clamp-1 break-all">Search results for &quot;{q}&quot;</h1>)}
                </div>
                {q === undefined && <TrendingTopics numberOfTopics={10} className="text-xl font-extrabold" />}
                {q !== '' && q !== undefined && <SearchResults query={q} />}
            </div>
            <TrendsSideBar />
        </main>
    )
}