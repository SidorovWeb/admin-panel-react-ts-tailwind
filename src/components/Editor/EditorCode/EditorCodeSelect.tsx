import { FC, useState } from 'react'

interface IEditorCodeSelect {
  array: string[]
  setSelect: (v: string) => void
  theme?: string
}

export const EditorCodeSelect: FC<IEditorCodeSelect> = ({ array, setSelect, theme }) => {
  const [value, setValue] = useState('')
  const select = (value: string) => {
    setSelect(value)
    setValue(value)
    if (theme) {
      localStorage.setItem('apsa-theme-editor', JSON.stringify(value))
    }
  }

  return (
    <div className='theme-selector flex space-x-2 items-center'>
      <select
        className=' bg-white dark:bg-slate-800 pr-8 cursor-pointer form-select appearance-none block w-full px-3 py-1.5 bg-clip-padding bg-no-repeat border border-slate-200 dark:border-slate-700 rounded m-0 focus:border-blue-600 focus:outline-none'
        value={theme ?? value}
        onChange={(e) => select(e.target.value)}
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
