import { FC } from 'react'
import { Button } from '../../UI/Button'

interface IEditorCodeTabs {
  mode: string
  setMode: (m: string) => void
}

export const EditorCodeTabs: FC<IEditorCodeTabs> = ({ mode, setMode }) => {
  const tabs = ['HTML', 'CSS', 'JS']

  const changeMode = (textContent: string) => {
    setMode(textContent.toLowerCase())
  }

  return (
    <div className='tabs space-x-2 py-5 text-center'>
      {tabs.map((m, idx) => (
        <Button
          key={idx}
          onClick={() => changeMode(m)}
          clName={`${
            mode.toLocaleLowerCase() === m.toLocaleLowerCase() ? '!bg-slate-800' : ''
          } btn-default min-w-[70px]`}
        >
          {m}
        </Button>
      ))}
    </div>
  )
}
