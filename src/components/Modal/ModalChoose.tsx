import axios from 'axios'
import { FC, MouseEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { pathAPI } from '../../Constants'
import Modal from './Modal'

interface ModalChooseProps {
  setCurrentPage: (page: string) => void
}

export const ModalChoose: FC<ModalChooseProps> = ({ setCurrentPage }) => {
  const [pages, setPages] = useState([])

  useEffect(() => {
    getListHtmlFiles()
  }, [])

  const redirect = (e: MouseEvent, page: string) => {
    e.preventDefault()
    setCurrentPage(page)
    const LS = JSON.parse(localStorage.getItem('apsa')!)
    localStorage.setItem('apsa', JSON.stringify({ ...LS, page }))
  }

  const getListHtmlFiles = async () => {
    return axios
      .get<[]>(`${pathAPI}htmlList.php`)
      .then((res) => {
        const filteredData = res.data.filter((item) => item !== 'temporaryFileCanBeDeleted.html')
        setPages(filteredData)
      })
      .catch((e) => toast.error(`Загрузить список страниц не удалось! ${e}`))
  }

  return (
    <Modal title='Открыть' id='modalChoose'>
      {' '}
      <div>
        {pages &&
          pages.map((page: string, idx: number) => (
            <div className='flex justify-center' key={idx}>
              <div className='w-full border-b border-slate-200 dark:border-slate-700'>
                <a
                  href='#!'
                  className='block px-6 py-2 w-full rounded focus:outline-none focus:ring-0 transition-opacity duration-300 ease-in-out hover:opacity-50 cursor-pointer'
                  onClick={(e) => redirect(e, page)}
                >
                  {page}
                </a>
              </div>
            </div>
          ))}
      </div>
    </Modal>
  )
}
