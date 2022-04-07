export const doughnutLegends = [
  { title: 'Petrol', color: 'bg-blue-500' },
  { title: 'Materials & Labor', color: 'bg-teal-600' },
  { title: 'Employee Benefits', color: 'bg-purple-600' },
  { title: 'Other Expenses', color: 'bg-fuchsia-500' }
]

export const lineLegends = [
  { title: 'Advance Payment', color: 'bg-teal-600' },
  { title: 'Direct Payment', color: 'bg-purple-600' },
]

export const barLegends = [
  { title: 'Materials & Labor', color: 'bg-teal-600' },
  { title: 'Employee Benefits', color: 'bg-purple-600' },
]

export const doughnutOptions = {
  data: {
    datasets: [
      {
        data: [10,20,50,20],
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: ['#0694a2', '#1c64f2', '#7e3af2', '#c026d3'],
        label: 'Dataset 1',
      },
    ],
    labels: ['Materials & Labor', 'Petrol', 'Employee Benefits', 'Other Expenses'],
  },
  options: {
    responsive: true,
    cutoutPercentage: 80,
  },
  legend: {
    display: true,
    position: 'bottom'
  },
}

export const lineOptions = {
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Organic',
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: [43, 48, 40, 54, 67, 73, 70],
        fill: false,
      },
      {
        label: 'Paid',
        fill: false,
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: '#7e3af2',
        borderColor: '#7e3af2',
        data: [24, 50, 64, 74, 52, 51, 65],
      },
    ],
  },
  options: {
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Month',
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value',
        },
      },
    },
  },
  legend: {
    display: false,
  },
}

export const barOptions = {
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Materials & Labor',
        backgroundColor: '#0694a2',
        // borderColor: window.chartColors.red,
        borderWidth: 1,
        data: [-3, 14, 52, 74, 33, 90, 70],
      },
      {
        label: 'Employee Benefits',
        backgroundColor: '#7e3af2',
        // borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [66, 33, 43, 12, 54, 62, 84],
      },
    ],
  },
  options: {
    responsive: true,
  },
  legend: {
    display: false,
  },
}
export const stackedOptions={
  responsive: true,
  legend: {
      display: true,
      position: 'bottom'
  },
  type:'bar',
  scales: {
      xAxes: [{
          stacked: true
      }],
      yAxes: [{
          stacked: true
      }]
  }
}
export const stackedData= {
  labels: ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Project 6', 'Project 7'],
  datasets: [
    {
      label: 'Expense',
      backgroundColor: '#9333ea',
      borderWidth: 1,
      stack: 1,
      hoverBorderColor: '#6b21a8',
      data: [650, 590, 800, 810, 560, 550, 400]
    },
    {
      label: 'Budget Remaining',
      backgroundColor: '#e9d5ff',
      borderWidth: 1,
      stack: 1,
      hoverBorderColor: '#6b21a8',
      data: [450, 790, 100, 410, 160, 850, 200]
    }
  ]
}
