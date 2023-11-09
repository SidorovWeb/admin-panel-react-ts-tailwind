import { FC, useState } from 'react'

interface ISelect {
    array: string[]
    setSelect: (v: string) => void
    defaultValue?: string
    width?: string
}

export const Select: FC<ISelect> = ({
    array,
    setSelect,
    defaultValue,
    width,
}) => {
    const [value, setValue] = useState('')

    const onChange = (value: string) => {
        setSelect(value)
        setValue(value)
    }

    return (
        <div className="theme-selector flex space-x-2 items-center">
            <select
                className={`bg-white dark:bg-slate-800 pr-8 min-h-[34px] cursor-pointer form-select  appearance-none block  px-1 md:px-3 md:pr-8  bg-clip-padding bg-no-repeat border border-slate-300 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-500  transition-bg rounded m-0  focus:border-blue-600 focus:outline-none min-w-[65px] w-full ${width}`}
                value={defaultValue ?? value}
                onChange={(e) => onChange(e.target.value)}
            >
                {array.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
            </select>
        </div>
    )
}
