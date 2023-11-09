import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
    MdBarChart,
    MdCode,
    MdOutlineCloudUpload,
    MdOutlineImage,
    MdOutlineShortText,
    MdOutlineMap,
    MdVideoSettings,
    MdHelpOutline,
} from 'react-icons/md'

interface IEditorSIdebar {
    switcher: string
    setSwitcher: (str: string) => void
    isActiveSidebar: boolean
    setIsActiveSidebar: (val: boolean) => void
}

export const EditorSIdebar: FC<IEditorSIdebar> = ({
    switcher,
    setSwitcher,
    isActiveSidebar,
    setIsActiveSidebar,
}) => {
    const { t } = useTranslation()

    const components = [
        { name: 'Dashboard', icon: <MdBarChart className="w-5 h-5" /> },
        { name: 'Images', icon: <MdOutlineImage className="w-5 h-5" /> },
        { name: 'Text', icon: <MdOutlineShortText className="w-5 h-5" /> },
        { name: 'Code', icon: <MdCode className="w-5 h-5" /> },
        { name: 'Maps', icon: <MdOutlineMap className="w-5 h-5" /> },
        { name: 'Video', icon: <MdVideoSettings className="w-5 h-5" /> },
        { name: 'Uploads', icon: <MdOutlineCloudUpload className="w-5 h-5" /> },
        { name: 'Manual', icon: <MdHelpOutline className="w-5 h-5" /> },
    ]

    return (
        <div
            className={`${
                isActiveSidebar
                    ? '!block fixed top-[65px] bottom-0 pt-5 pl-8 bg-white dark:bg-slate-800 z-50 left-0 shadow-lg'
                    : '!hidden'
            } md:relative hidden md:!block`}
        >
            <div className="space-y-4 pr-[80px] sticky top-10 ">
                {components.map((item) => (
                    <a
                        key={item.name}
                        href="!#"
                        className={`${
                            switcher === item.name
                                ? 'text-black font-medium dark:text-gray-500'
                                : 'hover:opacity-[0.7]'
                        } w-full transition-opacity duration-300 ease-in-out hover:opacity-[0.5] flex items-center space-x-1`}
                        onClick={(e) => {
                            e.preventDefault()
                            setSwitcher(item.name)
                            setIsActiveSidebar(false)
                        }}
                    >
                        {item.icon}
                        <p>{t(item.name)}</p>
                    </a>
                ))}
            </div>
        </div>
    )
}
