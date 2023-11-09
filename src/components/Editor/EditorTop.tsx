import { FC } from 'react'
import { Button } from '../UI/Button'
import { IoMdMenu } from 'react-icons/io'
import { ThemeToggle } from '../UI/ThemeToggle'
import { Select } from '../UI/Select'
import { MdOutlineLogout } from 'react-icons/md'
import { userActions } from '../../hooks/actions'
import { useTranslation } from 'react-i18next'

interface IEditorTop {
    setSwitcher: (str: string) => void
    isActiveSidebar: boolean
    setIsActiveSidebar: (val: boolean) => void
}

const EditorTop: FC<IEditorTop> = ({
    setSwitcher,
    isActiveSidebar,
    setIsActiveSidebar,
}) => {
    const { inactiveCodeEditor } = userActions()
    const { t, i18n } = useTranslation()

    const close = () => {
        inactiveCodeEditor()
        setSwitcher('')
    }

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-slate-800 py-4 h-[64px] border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-[1280px] m-auto px-[15px] md:px-[30px] w-full flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <Button
                        clName="btn-default !p-1 w-[34px] h-[34px] m-[2px] block md:hidden mr-2"
                        onClick={() => setIsActiveSidebar(!isActiveSidebar)}
                    >
                        <IoMdMenu className="w-full  h-full" />
                    </Button>
                    <span className="font-bold">APSA</span>
                </div>
                <div className="flex items-stretch space-x-2">
                    <ThemeToggle />
                    <Select
                        array={['ru', 'en']}
                        setSelect={changeLanguage}
                        defaultValue={i18n.language}
                    />
                    <Button
                        clName={`btn-default flex items-center !p-1 md:!p-2 h-[34px] w-[34px] ${
                            i18n.language === 'ru'
                                ? 'md:w-[90px]'
                                : 'md:w-[70px]'
                        }`}
                        onClick={close}
                    >
                        <MdOutlineLogout className="w-auto h-full md:h-[15px] md:-mt-[2px] flex-shrink-0 md:mr-1" />
                        <p className="hidden md:block">{t('close')}</p>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default EditorTop
