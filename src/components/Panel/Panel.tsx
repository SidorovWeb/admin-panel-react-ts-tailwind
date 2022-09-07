import React, { FC } from 'react'
import { Button } from '../UI/Button'
import {
  MdImage,
  MdImageSearch,
  MdLogout,
  MdOutlineEditNote,
  MdPageview,
  MdRestorePage,
  MdSave,
  MdTextFormat,
} from 'react-icons/md'

export const Panel: FC = () => {
  return (
    <div className='container fixed top-[20px] left-[50%] translate-x-[-50%] w-auto py-2 px-4 z-998 bg-slate-500 flex space-x-1 justify-center rounded shadow-md'>
      {/* <Button clName='btn-primary' dataBsToggle dataBsTarget='#modalEditorMeta'>
        <MdTextFormat className='h-full w-full' />
      </Button>
      <Button clName='btn-primary' dataBsToggle dataBsTarget='#modalEditorMeta'>
        <MdImageSearch className='h-full w-full' />
      </Button> */}
      <Button clName='btn-primary px-1 h-[40px]' dataBsToggle dataBsTarget='#modalEditorMeta'>
        <MdOutlineEditNote className='h-full w-full' />
      </Button>
      <Button clName='btn-primary px-1 h-[40px]' dataBsToggle dataBsTarget='#modalChoose'>
        <MdPageview className='h-full w-full' />
      </Button>
      <Button clName='btn-primary px-1 h-[40px]' dataBsToggle dataBsTarget='#confirmModal'>
        <MdSave className='h-full w-full' />
      </Button>
      <Button clName='btn-primary px-1 h-[40px]' dataBsToggle dataBsTarget='#modalBackup'>
        <MdRestorePage className='h-full w-full' />
      </Button>
      <Button clName='btn-danger px-1 h-[40px]' dataBsToggle dataBsTarget='#modalLogout'>
        <MdLogout className='h-full w-full' />
      </Button>
    </div>
  )
}
