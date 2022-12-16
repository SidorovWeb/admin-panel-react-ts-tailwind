import { FC } from 'react'
import { Button } from '../UI/Button'

interface ITabs {
  mode: string
  setMode: (m: string) => void
  tabs: string[]
}

export const Tabs: FC<ITabs> = ({ mode, setMode, tabs }) => {
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
