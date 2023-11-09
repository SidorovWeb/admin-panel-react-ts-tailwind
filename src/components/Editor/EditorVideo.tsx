import { FC, useEffect, useState } from 'react'
import { Button } from '../UI/Button'
import { useTranslation } from 'react-i18next'
import Youtube from '../../assets/youtube.svg'
import { published } from '../../helpers/utils'
import { toast } from 'react-toastify'

interface IEditorVideo {
    virtualDom: Document
    currentPage: string
}

interface IUpdateVideo {
    title: string
    id: string
    currentID: string
    onplay: boolean
}

const EditorVideo: FC<IEditorVideo> = ({ virtualDom, currentPage }) => {
    const iframe = document.querySelector('iframe')
    const video = iframe?.contentDocument?.body.querySelectorAll(
        '[data-youtube-video]'
    )
    const [updateVideo, setUpdateVideo] = useState<IUpdateVideo[]>([])
    const { t, i18n } = useTranslation()

    useEffect(() => {
        if (video) {
            const update = [...video].map((v) => {
                const id = v.getAttribute('data-youtube-video')
                const title = v.getAttribute('data-frame-title')

                return {
                    id,
                    currentID: id,
                    title,
                    onplay: false,
                } as IUpdateVideo
            })
            setUpdateVideo(update)
        }
    }, [])

    const onChange = (e: string, video: IUpdateVideo) => {
        setUpdateVideo((prevVideo) =>
            prevVideo.map((v) => (v.id === video.id ? { ...v, id: e } : v))
        )
    }

    const playVideo = (video: IUpdateVideo) => {
        setUpdateVideo((prevVideo) =>
            prevVideo.map((v) =>
                v.id === video.id ? { ...v, onplay: true } : v
            )
        )
    }

    const save = (video: IUpdateVideo) => {
        const selector = `[data-youtube-video="${video.currentID}"]`
        const virtual = (virtualDom?.body || document).querySelector(
            selector
        ) as HTMLElement
        const linkVirtual = virtual.querySelector('.video__link') as HTMLElement
        const iframe = document.querySelector('iframe')
        const videoIframe =
            iframe?.contentDocument?.body.querySelectorAll(selector)

        virtual.setAttribute('data-youtube-video', video.id)
        linkVirtual.setAttribute(
            'style',
            `background-image:url(https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg)`
        )

        if (videoIframe) {
            const linkIframe = videoIframe[0].querySelector(
                '.video__link'
            ) as HTMLElement
            videoIframe[0].setAttribute('data-youtube-video', video.id)
            linkIframe.setAttribute(
                'style',
                `background-image:url(https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg)`
            )
        }

        setUpdateVideo((prevVideo) =>
            prevVideo.map((v) =>
                v.id === video.id ? { ...v, currentID: video.id } : v
            )
        )

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

    if (!video?.length) {
        return (
            <div className="w-full">
                <p className="font-medium">Видео на странице не найдено.</p>
                <p className="font-medium mb-4">
                    Возможно забыли добавить атрибут:
                    <span className="font-bold ml-2">
                        data-youtube-video="ID Видео"
                    </span>
                </p>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {updateVideo &&
                updateVideo.map((video, id) => (
                    <div className="mb-4 text-right" key={id}>
                        <div className="font-bold mb-4 text-left">
                            Video ID: {video.currentID}
                        </div>
                        <input
                            className="block w-full md:w-[70%] lg:w-full mx-auto px-3 py-1.5 text-gray-700 dark:text-white bg-white dark:bg-slate-700 bg-clip-padding border dark:border-slate-700 rounded hover:border-slate-500 dark:hover:border-slate-500  transition-bg !mt-1 !mb-4 focus:border-blue-600 focus:outline-none font-medium caret-black dark:caret-white"
                            type="text"
                            placeholder="Video-ID"
                            value={video.id}
                            onChange={(e) => onChange(e.target.value, video)}
                        />
                        <div className="mb-4 w-full aspect-video hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg overflow-hidden">
                            {!video.onplay ? (
                                <div
                                    className="relative flex items-center justify-center cursor-pointer "
                                    onClick={() => playVideo(video)}
                                >
                                    <img
                                        src={`https://i.ytimg.com/vi_webp/${video.currentID}/maxresdefault.webp`}
                                        alt={video.title}
                                    />
                                    <span className="w-6 h-6 absolute bg-white z-1"></span>
                                    <img
                                        className="w-16 h-16 absolute z-2"
                                        src={Youtube}
                                        alt="Youtube button"
                                    />
                                </div>
                            ) : (
                                <iframe
                                    className="w-full aspect-video"
                                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                        <Button
                            clName="btn-success ml-auto"
                            onClick={() => save(video)}
                        >
                            {t('save')}
                        </Button>
                    </div>
                ))}
        </div>
    )
}

export default EditorVideo
