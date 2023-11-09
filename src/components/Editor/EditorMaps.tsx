import { FC, useEffect, useState } from 'react'
import { Button } from '../UI/Button'
import { useTranslation } from 'react-i18next'
import { published } from '../../helpers/utils'
import { toast } from 'react-toastify'

interface IEditorText {
    virtualDom: Document
    currentPage: string
}

interface IUpdateMaps {
    apikey: string
    address: string
    coordinates: string
    id: string
}

const EditorMaps: FC<IEditorText> = ({ virtualDom, currentPage }) => {
    const iframe = document.querySelector('iframe')
    const maps = iframe?.contentDocument?.body.querySelectorAll('[data-yamaps]')
    const [updateMaps, setUpdateMaps] = useState<IUpdateMaps[]>([])
    const { t, i18n } = useTranslation()

    useEffect(() => {
        if (maps) {
            const update = [...maps].map((map, idx) => {
                const id = map.getAttribute('id')
                const apikey = map.getAttribute('data-apikey')
                const address = map.getAttribute('data-address')
                const coordinates = map.getAttribute('data-coordinates')
                return {
                    apikey,
                    address,
                    coordinates,
                    id,
                } as IUpdateMaps
            })
            setUpdateMaps(update)
        }
    }, [])

    const onChange = (
        e: string,
        options: 'apikey' | 'address' | 'coordinates',
        map: IUpdateMaps
    ) => {
        setUpdateMaps((prevMaps) =>
            prevMaps.map((m) => (m.id === map.id ? { ...m, [options]: e } : m))
        )
    }

    const save = (map: IUpdateMaps) => {
        const selector = `#${map.id}`
        const virtualMap = (virtualDom?.body || document).querySelector(
            selector
        ) as HTMLElement

        console.log(selector)

        virtualMap.setAttribute('data-apikey', map.apikey)
        virtualMap.setAttribute('data-address', map.address)
        virtualMap.setAttribute('data-coordinates', map.coordinates)

        try {
            published(virtualDom, currentPage)
            if (i18n.language === 'ru') {
                toast.success('Успешно сохранено!')
            } else {
                toast.success('Saved successfully!')
            }
        } catch (error) {
            toast.error(`Failed Saved!`)
        }
    }

    if (!maps?.length) {
        return (
            <div className="w-full">
                <p className="font-medium">Карт на странице не найдено.</p>
                <p className="font-medium mb-4">
                    Возможно забыли добавить атрибуты:
                    <span className="font-bold ml-2">
                        data-yamaps="" data-yamaps-id="Your id"
                        data-apikey="Your API-key" data-address="Your address"
                        data-coordinates="Your coordinates"
                    </span>
                </p>
            </div>
        )
    }
    return (
        <div>
            {updateMaps &&
                updateMaps.map((map) => (
                    <div className="mb-4 text-right" key={map.id}>
                        <div className="font-bold mb-4 text-left">
                            Map ID: {map.id}
                        </div>
                        <input
                            className="block w-full md:w-[70%] lg:w-full mx-auto px-3 py-1.5 text-gray-700 dark:text-white bg-white dark:bg-slate-700 bg-clip-padding border dark:border-slate-700 rounded hover:border-slate-500 dark:hover:border-slate-500  transition-bg !mt-1 !mb-2 focus:border-blue-600 focus:outline-none font-medium caret-black dark:caret-white"
                            type="text"
                            placeholder="apikey"
                            value={map.apikey}
                            onChange={(e) =>
                                onChange(e.target.value, 'apikey', map)
                            }
                        />
                        <input
                            className="block w-full md:w-[70%] lg:w-full mx-auto px-3 py-1.5 text-gray-700 dark:text-white bg-white dark:bg-slate-700 bg-clip-padding border dark:border-slate-700 rounded hover:border-slate-500 dark:hover:border-slate-500  transition-bg !mt-1 !mb-2 focus:border-blue-600 focus:outline-none font-medium caret-black dark:caret-white"
                            type="text"
                            placeholder="address"
                            value={map.address}
                            onChange={(e) =>
                                onChange(e.target.value, 'address', map)
                            }
                        />
                        <input
                            className="block w-full md:w-[70%] lg:w-full mx-auto px-3 py-1.5 text-gray-700 dark:text-white bg-white dark:bg-slate-700 bg-clip-padding border dark:border-slate-700 rounded hover:border-slate-500 dark:hover:border-slate-500  transition-bg !mt-1 !mb-2 focus:border-blue-600 focus:outline-none font-medium caret-black dark:caret-white"
                            type="text"
                            placeholder="coordinates"
                            value={map.coordinates}
                            onChange={(e) =>
                                onChange(e.target.value, 'coordinates', map)
                            }
                        />
                        <Button clName="btn-success" onClick={() => save(map)}>
                            {t('save')}
                        </Button>
                    </div>
                ))}
        </div>
    )
}

export default EditorMaps
