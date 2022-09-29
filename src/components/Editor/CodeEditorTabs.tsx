import { FC } from 'react'
import { Button } from '../UI/Button'

interface ICodeEditorTabs {
  mode: string
  setMode: (m: string) => void
}

export const CodeEditorTabs: FC<ICodeEditorTabs> = ({ mode, setMode }) => {
  const tabs = ['HTML', 'CSS', 'JS']

  const changeMode = (textContent: string) => {
    setMode(textContent.toLowerCase())
  }

  return (
    <div className='tabs space-x-2 py-5 text-center'>
      {tabs.map((m, idx) => (
        <Button key={idx} onClick={() => changeMode(m)} clName='btn-primary min-w-[70px]'>
          {m}
        </Button>
      ))}
    </div>
  )
}
