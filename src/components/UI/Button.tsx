import React, { FC, KeyboardEvent } from 'react'

interface IButtonProps {
    children: React.ReactNode
    clName?: string
    onClick?: () => void
    dataBsDismiss?: boolean
    dataBsToggle?: boolean
    dataBsTarget?: string
    disabled?: boolean
}

export const Button: FC<IButtonProps> = ({
    children,
    clName,
    onClick,
    dataBsDismiss = false,
    dataBsToggle = false,
    dataBsTarget = '',
    disabled = false,
}) => {
    return (
        <button
            disabled={disabled}
            type="button"
            className={`inline-block py-2 px-3 text-xs leading-tight rounded shadow-md hover:shadow-lg focus:shadow-lg focus:border-blue-600 focus:ring-0 active:shadow-lg transition duration-150 ease-in-out ${clName} ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            data-bs-dismiss={dataBsDismiss ? 'modal' : ''}
            data-bs-toggle={dataBsToggle ? 'modal' : ''}
            data-bs-target={dataBsTarget}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
