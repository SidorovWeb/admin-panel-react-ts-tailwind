import { FC } from 'react'
import { MdOutlinePublishedWithChanges } from 'react-icons/md'
import { Button } from './Button'

interface IPublishedButton {
  onClick: () => void
}

export const PublishedButton: FC<IPublishedButton> = ({ onClick }) => {
  return (
    <Button clName='btn-success flex items-center fixed bottom-[5vh] left-[50%] -translate-x-[50%]' onClick={onClick}>
      <MdOutlinePublishedWithChanges className='w-full h-[15px] -mt-[2px] mr-1' />
      Опубликовать
    </Button>
  )
}
