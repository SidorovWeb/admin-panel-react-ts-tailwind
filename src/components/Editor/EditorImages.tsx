import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Button } from '../UI/Button'
import { uploadImage } from '../../helpers/images'
import axios from 'axios'
import { pathAPI } from '../../constants'
import { userActions } from '../../hooks/actions'
import { useAppSelector } from '../../hooks/redux'
import { convertBytes, imageSize, published } from '../../helpers/utils'
import { MdOutlineSearch } from 'react-icons/md'
import { MiniSpinner } from '../Spinners/MiniSpinner'
import { useTranslation } from 'react-i18next'
import { Search } from '../UI/Search'
import { toast } from 'react-toastify'

interface ImageData {
    size: number
    width: number
    height: number
    extension?: string
}

export interface IEditorImages {
    virtualDom: Document
    setVirtualDom: (dom: Document) => void
    currentPage: string
}

export interface IMapImages {
    img: HTMLImageElement
    id: number
    src: string
    baseSrc: string
    name: string
    width: number
    height: number
    size: number
    extension: string
}

export interface INewList {
    id: number
    text?: string
    src?: string
    extension?: string
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
    const [isCollapse, setIsCollapse] = useState(false)
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
                    if (import.meta.env.MODE == 'development') {
                        src = (img.baseURI +
                            'api/' +
                            img.getAttribute('src')) as string
                    }
                }
                if (import.meta.env.MODE !== 'development') {
                    if (img.src.includes('/apsa/')) {
                        src = img.src.replace('apsa/', '') as string
                    }
                }

                const name = img.getAttribute('alt') as string
                return {
                    img: img,
                    id: idx,
                    src: src,
                    baseSrc: img.getAttribute('src') || '',
                    name: name,
                    width: 0,
                    height: 0,
                    size: 0,
                    extension: '',
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
                    res.data.forEach((item: ImageData, id) => {
                        updateImageList({
                            id,
                            size: item.size,
                            width: item.width,
                            height: item.height,
                            extension: item.extension,
                        })
                    })
                })
                .catch((error) => toast.error(error))
                .finally(() => setIsSpinner(false))
        }
    }, [imagesList])

    useEffect(() => {
        if (text !== '') {
            updateImageList({ id, text: text })
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

    const onUpload = async (
        img: HTMLImageElement,
        id: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files && e.target.files[0]

        if (file) {
            try {
                const { width, height, size, extension } = await imageSize(file)
                const src = (await uploadImage({
                    img,
                    id,
                    virtualDom,
                    setVirtualDom,
                    file,
                })) as string

                await updateImageList({
                    id,
                    src,
                    width,
                    height,
                    size,
                    extension,
                })
                published(virtualDom, currentPage)
            } catch (error) {
                toast.error('error')
            }
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

    const updateImageList = ({
        id,
        text,
        src,
        width,
        height,
        size,
        extension,
    }: INewList) => {
        if (!imagesList) {
            return
        }

        const updatedList = imagesList.map((el) => {
            if (el.id !== id) return el

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

            if (text) el.name = text

            if (size) el.size = size

            if (extension) el.extension = extension

            return el
        })

        setFilteredImages(updatedList)
    }

    return (
        <>
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
                                <div className="rounded-t-lg w-full object-cover h-[210px] bg-slate-200 dark:bg-slate-500 overflow-hidden">
                                    <img
                                        className="w-full object-cover h-full"
                                        src={img.src}
                                        alt={img.name}
                                        loading="lazy"
                                    />
                                </div>
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
                                    <p className="text-inherit text-base opacity-[0.8]">
                                        Size:{' '}
                                        <span className="text-green-600">
                                            {convertBytes(img.size)}
                                        </span>{' '}
                                        -{' '}
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
                                    <p className="text-inherit text-base mb-2 opacity-[0.8]">
                                        extension: -{' '}
                                        {img.extension === 'webp' ? (
                                            <span className="text-green-600">
                                                {img.extension}
                                            </span>
                                        ) : (
                                            <span className="text-red-600">
                                                {t('extension')}
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
                                                className="hidden caret-black dark:caret-white"
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
        </>
    )
}
