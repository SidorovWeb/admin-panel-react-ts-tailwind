import axios from 'axios'
import { FC, MouseEvent } from 'react'
import { toast } from 'react-toastify'
import { pathAPI } from '../../Constants'
import { serializeDOMToString, unWrapTextNode, wrapImages } from '../../helpers/dom-helpers'
import { IBackupList } from '../../interface/backupList'
import { Button } from '../UI/Button'
import Modal from './modal'

interface ModalBackupProps {
  listBackups: IBackupList[]
  currentPage: string
  setLoading: (state: boolean) => void
  virtualDom: Document
  setDom: (dom: string) => void
}

export const ModalBackup: FC<ModalBackupProps> = ({ currentPage, listBackups, setLoading, virtualDom, setDom }) => {
  const save = () => {
    const newDom = virtualDom?.cloneNode(true)
    if (newDom) {
      unWrapTextNode(newDom)
      wrapImages(newDom)
      const html = serializeDOMToString(newDom, setDom)
      axios
        .post(`${pathAPI}savePage.php`, { pageName: currentPage, html })
        .then(() => {
          toast.success('Успешно сохранено!')
        })
        .catch((e) => toast.error(`Сохранить не удалось! ${e}`))
        .finally(() => setLoading(false))
    }
  }

  const restoreBackup = async (e: MouseEvent, time: string, backup: string) => {
    e.preventDefault()
    setLoading(true)
    return axios
      .post(`${pathAPI}restoreBackup.php`, { page: currentPage, file: backup })
      .then((res) => {
        const ls = JSON.parse(localStorage.getItem('apsw')!)
        localStorage.setItem('apsw', JSON.stringify({ ...ls, backupTime: time }))
        location.reload()
      })
      .catch((e) => toast.error(e))
      .catch((e) => toast.error(`Восстановить из backup не удалось! ${e}`))
  }

  return (
    <Modal title='Восстановить резервную копию' id='modalBackup'>
      <h4 className='text-sm text-red-600 mb-4'>
        Перед восстановлением резервной копии рекомендуется сохранить текущую страницу{' '}
        <Button clName='btn-success text-base !px-2 h-auto lowercase' onClick={save}>
          Сохранить
        </Button>
      </h4>
      <div>
        {listBackups &&
          listBackups.map((item) => (
            <div className='flex justify-center' key={item.time}>
              <div className='bg-white w-full border-b border-gray-200'>
                <a
                  href='#!'
                  className='block py-2 w-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-200 focus:text-gray-600 transition duration-500 cursor-pointer'
                  onClick={(e) => restoreBackup(e, item.time, item.file)}
                >
                  Резервная копия от {item.time}
                </a>
              </div>
            </div>
          ))}

        {!listBackups.length && 'Резервных копий нет'}
      </div>
    </Modal>
  )
}
