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
    <div className='tabs py-5 text-center flex flex-wrap items-center'>
      {tabs.map((m, idx) => (
        <Button
          key={idx}
          onClick={() => changeMode(m)}
          clName={`${
            mode.toLocaleLowerCase() === m.toLocaleLowerCase() ? '!bg-slate-800 dark:!bg-slate-700' : ''
          } btn-default min-w-[70px] mr-2 mb-2`}
        >
          {m}
        </Button>
      ))}
    </div>
  )
}
