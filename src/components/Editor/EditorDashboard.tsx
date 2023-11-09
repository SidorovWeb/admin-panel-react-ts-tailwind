import { FC, useEffect, useState } from 'react'
import { DoughnutChart } from './DoughnutChart'
import html from '../../assets/icons/html.svg'
import css from '../../assets/icons/css.svg'
import js from '../../assets/icons/js.svg'
import img from '../../assets/icons/img.svg'
import backup from '../../assets/icons/backup.svg'
import { useAppSelector } from '../../hooks/redux'
import { useTranslation } from 'react-i18next'
import { MiniSpinner } from '../Spinners/MiniSpinner'
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
                    htmlFiles?.length ?? 0,
                    cssFiles?.files.length ?? 0,
                    jsFiles?.files.length ?? 0,
                    images?.length ?? 0,
                    backupFiles?.length ?? 0,
                ],
            }

            setChartData(chart)
        }
    }, [htmlFiles, cssFiles, jsFiles, images, backupFiles])

    return (
        <div className="charts grid md:grid-cols-2 gap-16 justify-center">
            <div className="charts-pie h-[250px] md:h-[300px] md:w-full flex items-center justify-center">
                {!chartData && <MiniSpinner />}
                {chartData && <DoughnutChart chartData={chartData} />}
            </div>
            <div className="carts-file-list grid grid-cols-2 gap-4">
                <div className={cardStyle}>
                    <img
                        className="max-w-[22%] min-w-[32px]"
                        src={html}
                        alt="Your SVG"
                    />
                    {htmlFiles && <p>: {htmlFiles.length}</p>}
                    {!htmlFiles && (
                        <div className="flex items-center">
                            HTML: <MiniSpinner height={6} width={6} />
                        </div>
                    )}
                </div>
                <div className={cardStyle}>
                    <img
                        className="max-w-[22%] min-w-[32px]"
                        src={css}
                        alt="Your SVG"
                    />
                    {cssFiles && <p>: {cssFiles.files.length}</p>}
                    {!cssFiles && (
                        <div className="flex items-center">
                            CSS: <MiniSpinner height={6} width={6} />
                        </div>
                    )}
                </div>
                <div className={cardStyle}>
                    <img
                        className="max-w-[22%] min-w-[32px]"
                        src={js}
                        alt="Your SVG"
                    />
                    {jsFiles && <p>: {jsFiles.files.length}</p>}
                    {!jsFiles && (
                        <div className="flex items-center">
                            JS: <MiniSpinner height={6} width={6} />
                        </div>
                    )}
                </div>
                <div className={cardStyle}>
                    <img
                        className="max-w-[22%] min-w-[32px]"
                        src={img}
                        alt="Your SVG"
                    />
                    {images && <p>: {images.length}</p>}
                    {!images && (
                        <div className="flex items-center">
                            Images: <MiniSpinner height={6} width={6} />
                        </div>
                    )}
                </div>
                <div className={cardStyle}>
                    <img
                        className="max-w-[22%] min-w-[32px]"
                        src={backup}
                        alt="Your SVG"
                    />
                    {backupFiles && <p>: {backupFiles.length}</p>}
                    {!backupFiles && (
                        <div className="flex items-center">
                            Backup: <MiniSpinner height={6} width={6} />
                        </div>
                    )}
                </div>
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
