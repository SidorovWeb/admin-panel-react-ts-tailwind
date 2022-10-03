import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { pathAPI } from '../../Constants'
import { Button } from '../UI/Button'
import Modal from './Modal'

export const ModalBackup: FC = () => {
  const [backupList, setBackupList] = useState([]) as any

  const getBackupList = () => {
    axios.get<[]>(`${pathAPI}backupList.php`).then((res) => {
      const editedData = [] as any
      res.data.forEach((str: string) => {
        const idx = str.lastIndexOf('/')
        editedData.push(str.slice(idx + 1))
      })

      setBackupList(editedData)
    })
  }
  useEffect(() => {
    getBackupList()
  }, [])

  const backup = () => {
    axios
      .post(`${pathAPI}zipper.php`)
      .then((res) => {
        getBackupList()
        toast.success(`Архив ${res.data} успешно создан`)
      })
      .catch((e) => toast.error(`Ошибка! ${e}`))
  }

  return (
    <Modal
      title='Создать резервную копию?'
      id='modalBackup'
      footer={
        <Button clName='btn-success' onClick={backup} dataBsDismiss>
          Создать
        </Button>
      }
    >
      <div>
        {backupList &&
          backupList.map((item: string, idx: number) => (
            <div className='flex justify-center' key={idx}>
              <div className='bg-white w-full border-b border-gray-200 py-2'>{item}</div>
            </div>
          ))}

        {!backupList.length && 'Резервных копий нет'}
      </div>
    </Modal>
  )
}
