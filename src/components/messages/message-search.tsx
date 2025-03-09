import { Search } from "lucide-react"

export const MessageSearch = () => {
    return (
        <button
         className="group px-2 py-2 rounded-md flex items-center bg-zinc-900 gap-x-2 w-full hover:bg-zinc-700/10 transition">
            <Search className="w-4 h-4 text-zinc-500"/>
            <p className="font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 ">
                Search 
            </p>
        </button>
    )
}