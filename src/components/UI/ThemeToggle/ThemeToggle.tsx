import { FC, useEffect, useState } from 'react'

export const ThemeToggle: FC = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('apsa-themes')!) === 'dark') {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    } else {
      localStorage.setItem('apsa-themes', JSON.stringify('light'))
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const changeTheme = (dark: boolean) => {
    if (dark) {
      localStorage.setItem('apsa-themes', JSON.stringify('dark'))

      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('apsa-themes', JSON.stringify('light'))
    }
  }

  function toggleTheme() {
    changeTheme(!darkMode)
    setDarkMode((prev) => !prev)
  }

  return (
    <div
      className='w-12 rounded-full py-1 cursor-pointer flex items-center px-1/2 relative select-none bg-slate-500'
      onClick={toggleTheme}
    >
      <div
        className={`${darkMode ? 'translate-x-6' : 'translate-x-0'} h-5 w-5 rounded-full transform transition-all`}
      />

      <button className={`text-center text-sm flex-shrink ml-auto absolute top-50 ${darkMode ? 'left-1' : 'right-1'}`}>
        {darkMode ? '🌜' : '🌞'}
      </button>
    </div>
  )
}
