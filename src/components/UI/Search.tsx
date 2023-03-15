import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface ISearch {
    value: string
    onChange: (e: string) => void
    placeholder: string
}

export const Search: FC<ISearch> = ({ value, onChange, placeholder }) => {
    const { t } = useTranslation()

    return (
        <input
            type="search"
            className="form-control block w-full px-10 py-1.5 mx-0 text-base text-gray-700 dark:text-white bg-white dark:bg-slate-700 bg-clip-padding border dark:border-slate-700 rounded m-6 focus:border-blue-600 focus:outline-none"
            placeholder={placeholder}
            // placeholder={t('searchPlaceholderText') as string}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}
