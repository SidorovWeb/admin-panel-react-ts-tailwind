import React, { FC, ReactElement } from 'react'

interface IButtonProps {
  children: React.ReactNode
  clName?: string
  onClick?: () => void
  dataBsDismiss?: boolean
  dataBsToggle?: boolean
  dataBsTarget?: string
}

export const Button: FC<IButtonProps> = ({
  children,
  clName,
  onClick,
  dataBsDismiss = false,
  dataBsToggle = false,
  dataBsTarget = '',
}) => {
  return (
    <button
      type='button'
      className={`inline-block py-2 px-3 font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out ${clName}`}
      data-bs-dismiss={dataBsDismiss ? 'modal' : ''}
      data-bs-toggle={dataBsToggle ? 'modal' : ''}
      data-bs-target={dataBsTarget}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
