

import Link from "next/link";
import SearchField from "./search-field";
import UserButton from "./user-button";


export default function NavBar() {
    return (
        <header className="sticky top-0 z-10 dark:bg-[#161616] dark:text-[#f5f5f5] bg-white text-gray-900 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-5 px-5 py-3">
                <Link href={"/dashboard"} className="text-2xl font-bold text-primary">Spotlight</Link>
                <SearchField/>
                <UserButton className="sm:ms-auto" />
            </div>
        </header>
    )
}