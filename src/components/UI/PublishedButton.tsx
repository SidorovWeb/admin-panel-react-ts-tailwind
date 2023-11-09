import { FC } from 'react'
import { MdOutlinePublishedWithChanges } from 'react-icons/md'
import { Button } from './Button'
import { useTranslation } from 'react-i18next'

interface IPublishedButton {
    onClick?: () => void
}

export const PublishedButton: FC<IPublishedButton> = ({ onClick }) => {
    const { t } = useTranslation()
    return (
        <Button clName="btn-success flex items-center ml-2" onClick={onClick}>
            <MdOutlinePublishedWithChanges className="w-full h-[20px] -mt-[2px] mr-1 " />
            {t('publish')}
        </Button>
    )
}
