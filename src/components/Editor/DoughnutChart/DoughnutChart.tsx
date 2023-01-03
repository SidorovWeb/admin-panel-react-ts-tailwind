import { FC } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { IChartData } from '../Dashboard/Dashboard'

ChartJS.register(ArcElement, Tooltip, Legend)

interface IDoughnutChart {
  chartData: IChartData
}

export const DoughnutChart: FC<IDoughnutChart> = ({ chartData }) => {
  const data = {
    labels: chartData.labels,

    datasets: [
      {
        label: ' ',
        data: chartData.data,
        backgroundColor: [
          'rgba(236, 103, 49, 0.8)',
          'rgba(1, 150, 230, 0.8)',
          'rgba(239, 175, 75, 0.8)',
          'rgba(38, 185, 154, 0.8)',
        ],
        cutout: '70%',
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  }

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
        },
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: () => '',
          label: (tooltipItem: any) => {
            var dataset = data.datasets[tooltipItem.datasetIndex]
            var index = tooltipItem.dataIndex
            return data.labels[index] + ': ' + dataset.data[index]
          },
        },
      },
    },
  }

  return <Doughnut data={data} options={options} />
}
