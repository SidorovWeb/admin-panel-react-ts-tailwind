import { FC } from 'react'

interface ISearch {
    value: string
    onChange: (e: string) => void
    placeholder: string
}

export const Search: FC<ISearch> = ({ value, onChange, placeholder }) => {
    return (
        <input
            type="search"
            className="form-control block w-full px-10 py-1.5 mx-0 text-base text-gray-700 dark:text-white bg-white  dark:bg-slate-700  bg-clip-padding border border-slate-300 hover:border-slate-500 dark:border-slate-700 dark:hover:border-slate-500 rounded m-6 focus:border-blue-600 focus:outline-none transition-bg caret-black dark:caret-white"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}
