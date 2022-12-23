import React, { FC, useEffect, useState } from 'react'
import { DoughnutChart } from '../DoughnutChart/DoughnutChart'
import html from '../../../assets/icons/html.svg'
import css from '../../../assets/icons/css.svg'
import js from '../../../assets/icons/js.svg'
import img from '../../../assets/icons/img.svg'
import backup from '../../../assets/icons/backup.svg'
import axios from 'axios'
import { pathAPI } from '../../../Constants'
import { toast } from 'react-toastify'
import { Button } from '../../UI/Button'
import { MiniSpinner } from '../../Spinners/MiniSpinner'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../../hooks/redux'

interface IDashboard {}
interface IFiles {
  files: string[]
  path: string[]
}
export interface IChartData {
  labels: string[]
  data: number[]
}

export const Dashboard: FC<IDashboard> = ({}) => {
  const cardStyle =
    'border border-inherit rounded flex items-center justify-center px-4 py-6 shadow-md border-slate-200 dark:border-slate-700'
  const [htmlFiles, setHtmlFiles] = useState<string[]>()
  const [cssFiles, setCssFiles] = useState<IFiles>()
  const [jsFiles, setJsFiles] = useState<IFiles>()
  const [imgFiles, setImgFiles] = useState<[]>()
  const [backupFiles, setBackupFiles] = useState<NodeList>()
  const [chartData, setChartData] = useState<IChartData>()
  const { images } = useAppSelector((state) => state.getImage)
  const { t } = useTranslation()

  const getList = async (nameFile: string, setFun: (v: any) => void) => {
    return await axios
      .get<[]>(`${pathAPI}${nameFile}`)
      .then((res) => {
        let files = [] as string[]

        res.data.forEach((f: string) => {
          const fileName = f.split('/').pop()
          if (fileName) files.push(fileName)
        })
        setFun({ files, path: res.data })
      })
      .catch((e) => toast.error(`Загрузить список файлов не удалось! ${e}`))
  }

  const getBackupList = async () => {
    return await axios
      .get<[]>(`${pathAPI}backupList.php`)
      .then((res) => {
        const editedData = [] as any
        res.data.forEach((str: string) => {
          const idx = str.lastIndexOf('/')
          editedData.push(str.slice(idx + 1))
        })

        setBackupFiles(editedData)
      })
      .catch((e) => toast.error(`Загрузить список файлов не удалось! ${e}`))
  }

  const getListHtmlFiles = async () => {
    return await axios
      .get<[]>(`${pathAPI}htmlList.php`)
      .then((res) => {
        const filteredData = res.data.filter((item) => item !== 'temporaryFileCanBeDeleted.html')
        setHtmlFiles(filteredData)
      })
      .catch((e) => toast.error(`Загрузить список страниц не удалось! ${e}`))
  }

  useEffect(() => {
    setImgFiles(images)
    getListHtmlFiles()
    getList('cssList.php', setCssFiles)
    getList('jsList.php', setJsFiles)
    getBackupList()
  }, [])

  useEffect(() => {
    if (htmlFiles?.length && cssFiles?.files && jsFiles?.files.length) {
      const chart = {
        labels: ['HTML', 'CSS', 'JS', 'IMG'],
        data: [htmlFiles?.length ?? 0, cssFiles?.files.length ?? 0, jsFiles?.files.length ?? 0, imgFiles?.length ?? 0],
      }

      setChartData(chart)
    }
  }, [htmlFiles, cssFiles, jsFiles, imgFiles])

  return (
    <div className='charts grid grid-cols-2 gap-2 '>
      <div className='charts-pie h-[300px] flex items-center justify-center'>
        {!chartData && <MiniSpinner />}
        {chartData && <DoughnutChart chartData={chartData} />}
      </div>
      <div className='carts-file-list grid grid-cols-2 gap-4'>
        <div className={cardStyle}>
          <img className='max-w-[22%]' src={html} alt='Your SVG' />
          {htmlFiles && <p>: {htmlFiles.length}</p>}
          {!htmlFiles && (
            <div className='flex items-center'>
              HTML: <MiniSpinner height={6} width={6} />
            </div>
          )}
        </div>
        <div className={cardStyle}>
          <img className='max-w-[22%]' src={css} alt='Your SVG' />
          {cssFiles && <p>: {cssFiles.files.length}</p>}
          {!cssFiles && (
            <div className='flex items-center'>
              CSS: <MiniSpinner height={6} width={6} />
            </div>
          )}
        </div>
        <div className={cardStyle}>
          <img className='max-w-[22%]' src={js} alt='Your SVG' />
          {jsFiles && <p>: {jsFiles.files.length}</p>}
          {!jsFiles && (
            <div className='flex items-center'>
              JS: <MiniSpinner height={6} width={6} />
            </div>
          )}
        </div>
        <div className={cardStyle}>
          <img className='max-w-[22%]' src={img} alt='Your SVG' />
          {imgFiles && <p>: {imgFiles.length}</p>}
          {!imgFiles && (
            <div className='flex items-center'>
              Images: <MiniSpinner height={6} width={6} />
            </div>
          )}
        </div>
        <div className={cardStyle}>
          <img className='max-w-[22%]' src={backup} alt='Your SVG' />
          {backupFiles && <p>: {backupFiles.length}</p>}
          {!backupFiles && (
            <div className='flex items-center'>
              Backup: <MiniSpinner height={6} width={6} />
            </div>
          )}
        </div>
        <div className={cardStyle}>
          <Button clName='btn-primary' dataBsToggle dataBsTarget='#modalBackup'>
            {t('CreateBackups')}
          </Button>
        </div>
      </div>
    </div>
  )
}
