import React, { FC } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface IDoughnutChart {}

export const DoughnutChart: FC<IDoughnutChart> = () => {
  const data = {
    labels: ['HTML', 'CSS', 'JS', 'IMG'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(236, 103, 49, 0.8)',
          'rgba(1, 150, 230, 0.8)',
          'rgba(239, 175, 75, 0.8)',
          'rgba(38, 185, 154, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return <Doughnut data={data} />
}
