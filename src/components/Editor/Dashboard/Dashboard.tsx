import React, { FC } from 'react'
import { DoughnutChart } from '../DoughnutChart/DoughnutChart'
import { SiCsswizardry, SiHtml5, SiJavascript } from 'react-icons/si'
import html from '../../Icons/html.svg'
import css from '../../Icons/css.svg'
import js from '../../Icons/js.svg'
import img from '../../Icons/img.svg'
import backup from '../../Icons/backup.svg'

interface IDashboard {}

export const Dashboard: FC<IDashboard> = ({}) => {
  const cardStyle = 'border border-slate-200 rounded flex items-center justify-center'

  return (
    <div className='charts grid grid-cols-2 gap-2'>
      <div className='charts-pie h-[300px]  flex items-center justify-center'>
        <DoughnutChart />
      </div>
      <div className='carts-file-list grid grid-cols-2 gap-2'>
        <div className={cardStyle}>
          {/* <SiHtml5 /> */}
          <img className='max-w-[20%]' src={html} alt='Your SVG' />
        </div>
        <div className={cardStyle}>
          {/* <SiCsswizardry /> */}
          <img className='max-w-[20%]' src={css} alt='Your SVG' />
        </div>
        <div className={cardStyle}>
          {/* <SiJavascript /> */}
          <img className='max-w-[20%]' src={js} alt='Your SVG' />
        </div>
        <div className={cardStyle}>
          <img className='max-w-[20%]' src={img} alt='Your SVG' />
        </div>
        <div className={cardStyle}>
          <img className='max-w-[20%]' src={backup} alt='Your SVG' />
        </div>
        <div className={cardStyle}>Create Backups</div>
      </div>
    </div>
  )
}
