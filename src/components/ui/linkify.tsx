import Link from "next/link"
import { LinkIt, LinkItUrl } from "react-linkify-it"

export default function Linkify({ children }: { children: React.ReactNode }) {
    return (
        <LinkifyUsername>
            <LinkifyHashtag>
                <LinkifyUrl>{children}</LinkifyUrl>
            </LinkifyHashtag>
        </LinkifyUsername>
    )
}

function LinkifyUrl({ children }: { children: React.ReactNode }) {
    return (
        <LinkItUrl className="text-blue-400 hover:underline">{children}</LinkItUrl>
    )
}

function LinkifyUsername({ children }: { children: React.ReactNode }) {
    return <LinkIt regex={/(@[a-zA-Z0-9_-]+)/} component={(match, key) => {
        if(match.slice(1).toLowerCase()==="spotlight") return <Link key={key} href={`/dashboard`} className=" text-blue-400 hover:underline">{match}</Link>
        return <Link key={key} href={`/users/${match.slice(1)}`} className=" text-blue-400 hover:underline">{match}</Link>
    }}>{children}</LinkIt>
}

function LinkifyHashtag({ children }: { children: React.ReactNode }) {
    return <LinkIt regex={/(#[a-zA-Z0-9]+)/}
        component={(match, key) => {
            return <Link key={key} href={`hashtag/${match.slice(1)}`} className="text-blue-400 hover:underline">{match}</Link>
        }}
    >{children}</LinkIt>
}