import React, { FC } from 'react'
import { Button } from '../UI/Button'

export const Panel: FC = () => {
  return (
    <div className='container fixed top-0 right-0 z-998'>
      <div className='flex space-x-2 justify-center absolute top-0 right-0'>
        <Button clName='btn-primary' dataBsToggle dataBsTarget='#modalEditorMeta'>
          Редактировать meta
        </Button>
        <Button clName='btn-primary' dataBsToggle dataBsTarget='#modalChoose'>
          Открыть
        </Button>
        <Button clName='btn-primary' dataBsToggle dataBsTarget='#confirmModal'>
          Опубликовать
        </Button>
        <Button clName='btn-primary' dataBsToggle dataBsTarget='#modalBackup'>
          Восстановить
        </Button>
        <Button clName='btn-danger' dataBsToggle dataBsTarget='#modalLogout'>
          Выйти
        </Button>
      </div>
    </div>
  )
}
