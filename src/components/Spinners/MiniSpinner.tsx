import { FC } from 'react'

interface IMiniSpinner {
    width?: number
    height?: number
}

export const MiniSpinner: FC<IMiniSpinner> = ({ width = 8, height = 8 }) => {
    return (
        <div className=" text-center flex justify-center item-center">
            <div
                className={`spinner-border animate-spin  w-${width} h-${height} border-4 rounded-full text-slate-300`}
                role="status"
            >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
