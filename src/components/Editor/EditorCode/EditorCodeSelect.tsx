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
      localStorage.setItem('apsw-theme', JSON.stringify(value))
    }
  }

  return (
    <div className='theme-selector flex space-x-2 items-center'>
      <select
        className='pr-8 cursor-pointer form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example'
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
