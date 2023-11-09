import { FC, useEffect, useState } from 'react'
import { BsFillBrightnessHighFill, BsFillMoonStarsFill } from 'react-icons/bs'

export const ThemeToggle: FC = () => {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('apsa-themes')!) === 'dark') {
            setDarkMode(true)
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
            className="w-[64px] rounded-full px-3 cursor-pointer flex items-center relative select-none bg-slate-500 hover:bg-slate-600 transition-all"
            onClick={toggleTheme}
        >
            <div
                className={`${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                } h-5 w-5 rounded-full transform transition-all`}
            >
                <button
                    className={`absolute top-[50%] -translate-y-[50%] text-lg ${
                        darkMode ? 'left-2' : 'right-1'
                    }`}
                >
                    {darkMode ? (
                        <BsFillMoonStarsFill className="text-white h-4 w-4" />
                    ) : (
                        <BsFillBrightnessHighFill className="text-white h-5 w-5" />
                    )}
                </button>
            </div>
        </div>
    )
}
