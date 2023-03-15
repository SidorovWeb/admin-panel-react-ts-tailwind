import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Button } from '../../UI/Button'
import { uploadImage } from '../../../helpers/images'
import axios from 'axios'
import { pathAPI } from '../../../constants'
import { userActions } from '../../../hooks/actions'
import { useAppSelector } from '../../../hooks/redux'
import { convertBytes, imageSize, toPublish } from '../../../helpers/utils'
import { MdOutlineSearch } from 'react-icons/md'
import { parseStrDom } from '../../../helpers/dom-helpers'
import { PublishedButton } from '../../UI/PublishedButton'
import { MiniSpinner } from '../../Spinners/MiniSpinner'
import { useTranslation } from 'react-i18next'
import { Search } from '../../UI/Search'

interface IEditorImages {
    virtualDom: Document
    setVirtualDom: (dom: Document) => void
    currentPage: string
}

interface IMapImages {
    img: HTMLImageElement
    id: number
    src: string
    baseSrc: string
    name: string
    width: number
    height: number
    size: number
}

interface INewList {
    id: number
    text?: string
    src?: string
    baseSrc?: string
    width?: number
    height?: number
    size?: number
}

export const EditorImages: FC<IEditorImages> = ({
    virtualDom,
    setVirtualDom,
    currentPage,
}) => {
    const [imagesList, setImagesList] = useState<IMapImages[]>()
    const [filteredImages, setFilteredImages] = useState<IMapImages[]>()
    const [search, setSearch] = useState('')
    const { setText } = userActions()
    const { id, text } = useAppSelector((state) => state.setText)
    const { images } = useAppSelector((state) => state.getImage)
    const [isSpinner, setIsSpinner] = useState(true)
    const serializer = new XMLSerializer()
    const { t } = useTranslation()

    useEffect(() => {
        const mapImages =
            images &&
            [...images].map((i, idx) => {
                const img = i as HTMLImageElement
                let src = ''
                src = img.src
                if (img.src.includes('/upload_image/')) {
                    src = img.src
                } else {
                    src = (img.baseURI +
                        'api/' +
                        img.getAttribute('src')) as string
                }
                if (import.meta.env.MODE !== 'development') {
                    if (img.src.includes('/apsa/')) {
                        src = img.src.replace('apsa/', '') as string
                    }
                }

                const name = img.getAttribute('alt') as string
                return {
                    img,
                    id: idx,
                    src,
                    baseSrc: img.getAttribute('src') as string,
                    name,
                    width: 0,
                    height: 0,
                    size: 0,
                }
            })
        setImagesList(mapImages)
        if (!mapImages?.length) {
            setIsSpinner(false)
        }
    }, [])

    useEffect(() => {
        if (imagesList?.length) {
            const urls = imagesList
                .filter((img) => img.baseSrc)
                .map((img) => {
                    if (import.meta.env.MODE === 'development') {
                        if (img.src.includes(`${window.location.href}api`)) {
                            return img.src.replace(
                                `${window.location.href}api`,
                                '.'
                            )
                        }
                    }
                    const newHref = window.location.href.replace('/apsa/', '')
                    return img.src.replace(`${newHref}`, '../../')
                })

            axios
                .post<[]>(`${pathAPI}getImageData.php`, { imgList: urls })
                .then((res) => {
                    res.data.forEach(
                        (
                            item: {
                                size: number
                                width: number
                                height: number
                            },
                            id
                        ) => {
                            newList({
                                id,
                                size: item.size,
                                width: item.width,
                                height: item.height,
                            })
                        }
                    )
                })
                .catch((e) => console.error(e))
                .finally(() => setIsSpinner(false))
        }
    }, [imagesList])

    useEffect(() => {
        if (text !== '') {
            newList({ id, text: text })
            filter(' ')
        }
    }, [text])

    const filter = (str?: string) => {
        if (!str) {
            setFilteredImages(imagesList)
            return
        }
        if (imagesList && str) {
            const filtered = imagesList.filter((obj) =>
                obj.name.toLowerCase().trim().includes(str.toLowerCase().trim())
            )
            setFilteredImages(filtered)
        }
    }

    const onSearch = (str: string) => {
        filter(str)
        setSearch(str)
    }

    const onUpload = (
        img: HTMLImageElement,
        id: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files && e.target.files[0]) {
            imageSize(e.target.files[0]).then((res) => {
                if (e.target.files && e.target.files[0]) {
                    uploadImage({
                        img,
                        id,
                        virtualDom,
                        setVirtualDom,
                        file: e.target.files[0],
                    }).then((src: any) => {
                        newList({
                            id,
                            src,
                            width: res.width,
                            height: res.height,
                            size: res.size,
                        })
                    })
                }
            })
        }
    }

    const editingText = (name: string, id: number) => {
        if (virtualDom) {
            setText({
                id: id,
                text: name,
                element: 'img',
                selector: `[apsa-img="${id}"]`,
            })
        }
    }

    const newList = ({ id, text, src, width, height, size }: INewList) => {
        const newList =
            imagesList &&
            imagesList?.map((el) => {
                if (el.id === id) {
                    if (width && height) {
                        el.width = width
                        el.height = height
                    }
                    if (src) {
                        if (
                            import.meta.env.MODE !== 'development' &&
                            src.includes('/apsa/')
                        ) {
                            el.src = src.replace('apsa/', '') as string
                        } else {
                            el.src = src
                        }
                    }
                    if (text) {
                        el.name = text
                    }
                    if (size) {
                        el.size = size
                    }

                    return el
                }
                return el
            })

        setFilteredImages(newList)
    }

    const published = () => {
        const newHtml = serializer.serializeToString(virtualDom)
        const document = parseStrDom(newHtml)

        toPublish({ newVirtualDom: document, currentPage })
    }

    return (
        <div>
            <button
                className="btn-default focus:outline-none relative inline-block py-2 px-3 mb-4 text-xs leading-tight rounded shadow-md hover:shadow-lg focus:shadow-lg focus:border-blue-600 focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                type="button"
                data-te-collapse-init
                data-te-ripple-init
                data-te-target="#collapse"
            >
                {t('usageExample')}
            </button>
            <div
                className="!visible hidden"
                id="collapse"
                data-te-collapse-item
            >
                <p className="bg-amber-100 dark:text-gray-700 p-4 rounded-lg mb-4">
                    {
                        "<picture><source srcset='images/example.webp' type='image/webp' /><img src='images/example.jpg' alt='example' /></picture>"
                    }
                </p>
                <p className="bg-amber-100 dark:text-gray-700 p-4 rounded-lg">
                    {"<img src='images/example.jpg' alt='example' />"}
                </p>
            </div>

            <div className="mb-3 relative w-full">
                <MdOutlineSearch className="absolute top-[50%] left-2 translate-y-[-50%] opacity-[0.4] w-6 h-6" />
                <Search
                    value={search}
                    onChange={onSearch}
                    placeholder={t('searchPlaceholderName') as string}
                />
            </div>
            {isSpinner && <MiniSpinner />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center w-full">
                {!isSpinner &&
                    filteredImages &&
                    [...filteredImages].map((img) => (
                        <div
                            className="flex justify-center hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg border border-slate-200 dark:border-slate-700"
                            key={img.id}
                        >
                            <div className="w-full">
                                <img
                                    className="rounded-t-lg w-full object-cover min-h-[210px] max-h-[210px] bg-slate-200 dark:bg-slate-500"
                                    src={img.src}
                                    alt={img.name}
                                    loading="lazy"
                                />
                                <div className="p-4">
                                    <p className="text-inherit text-base font-medium">
                                        {t('nameImage')}: {img.name}
                                    </p>
                                    <p className="text-inherit text-base opacity-[0.8]">
                                        Width: {img.width}px
                                    </p>
                                    <p className="text-inherit text-base opacity-[0.8]">
                                        Height: {img.height}px
                                    </p>
                                    <p className="text-inherit text-base mb-2 opacity-[0.8]">
                                        Size: {convertBytes(img.size)} -{' '}
                                        {img.size < 500 ? (
                                            <span className="text-green-600">
                                                {t('goodSize')}
                                            </span>
                                        ) : (
                                            <span className="text-red-600">
                                                {t('bigSize')}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <Button clName="relative btn-default mb-4 mr-2 overflow-hidden cursor-pointer">
                                        {t('chooseFile')}
                                        <label className="flex flex-col items-center cursor-pointer absolute inset-0">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) =>
                                                    onUpload(img.img, img.id, e)
                                                }
                                            />
                                        </label>
                                    </Button>
                                    <Button
                                        clName="btn-default mb-4"
                                        onClick={() =>
                                            editingText(img.name, img.id)
                                        }
                                        dataBsToggle
                                        dataBsTarget="#modalEditText"
                                    >
                                        {t('alt')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                {!isSpinner && filteredImages && !filteredImages.length && (
                    <div className="text-xl mt-6">{t('nameNotFound')}</div>
                )}
                {!isSpinner && !filteredImages && (
                    <div className="text-xl mt-6">{t('imagesNotFound')}</div>
                )}
            </div>
            <PublishedButton onClick={published} />
        </div>
    )
}
