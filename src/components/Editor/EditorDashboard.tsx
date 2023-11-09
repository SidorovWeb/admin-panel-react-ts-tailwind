import { FC, useEffect, useState } from 'react'
import { EditorDoughnutChart } from './EditorDoughnutChart'
import html from '../../assets/icons/html.svg'
import css from '../../assets/icons/css.svg'
import js from '../../assets/icons/js.svg'
import img from '../../assets/icons/img.svg'
import backup from '../../assets/icons/backup.svg'
import { useAppSelector } from '../../hooks/redux'
import { useTranslation } from 'react-i18next'
import { Button } from '../UI/Button'

interface IDashboard {}

export interface IChartData {
    labels: string[]
    data: number[]
}

export const Dashboard: FC<IDashboard> = ({}) => {
    const cardStyle =
        'border border-inherit rounded flex items-center justify-center px-4 py-6 shadow-md border-slate-200 dark:border-slate-700'
    const [chartData, setChartData] = useState<IChartData>()
    const { images } = useAppSelector((state) => state.getImage)
    const { htmlFiles } = useAppSelector((state) => state.htmlFiles)
    const { cssFiles } = useAppSelector((state) => state.cssFiles)
    const { jsFiles } = useAppSelector((state) => state.jsFiles)
    const { backupFiles } = useAppSelector((state) => state.backupFiles)
    const { t } = useTranslation()

    useEffect(() => {
        if (htmlFiles?.length && cssFiles?.files && jsFiles?.files.length) {
            const chart = {
                labels: ['HTML', 'CSS', 'JS', 'IMG', 'Backups'],
                data: [
                    htmlFiles?.length,
                    cssFiles?.files.length,
                    jsFiles?.files.length,
                    images?.length,
                    backupFiles?.length,
                ],
            }

            setChartData(chart)
        }
    }, [htmlFiles, cssFiles, jsFiles, images, backupFiles])

    const components = [
        {
            icon: html,
            files: htmlFiles.length,
        },
        {
            icon: css,
            files: cssFiles.files.length,
        },
        {
            icon: js,
            files: jsFiles.files.length,
        },
        {
            icon: img,
            files: images.length,
        },
        {
            icon: backup,
            files: backupFiles.length,
        },
    ]

    return (
        <div className="charts grid md:grid-cols-2 gap-16 justify-center">
            <div className="charts-pie h-[250px] md:h-[300px] md:w-full flex items-center justify-center">
                {chartData && <EditorDoughnutChart chartData={chartData} />}
            </div>
            <div className="carts-file-list grid grid-cols-2 gap-4">
                {components.map((item, idx) => (
                    <div className={cardStyle} key={idx}>
                        <img
                            className="max-w-[22%] min-w-[32px]"
                            src={item.icon}
                            alt="Your SVG"
                        />
                        {item.files && <p>: {item.files}</p>}
                    </div>
                ))}
                <div className={cardStyle}>
                    <Button
                        clName="btn-primary"
                        dataBsToggle
                        dataBsTarget="#modalBackup"
                    >
                        {t('CreateBackups')}
                    </Button>
                </div>
            </div>

            {backupFiles && backupFiles.length ? (
                <div className="bg-amber-100 dark:text-gray-900 p-4 rounded-lg mb-4">
                    {t('backupFolder')} ./backups/
                </div>
            ) : (
                <div className="bg-red-200 dark:text-gray-900  p-4 rounded-lg mb-4">
                    {t('recommendedBackup')}
                </div>
            )}
        </div>
    )
}
