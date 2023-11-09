import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import ReactCodeMirror from '@uiw/react-codemirror'
import { FC } from 'react'

const EditorVideoManual: FC = ({}) => {
    return (
        <div>
            <div className="mt-4">
                <div className="font-bold text-left text-xl mb-4">Видео</div>
                <div className="rounded relative w-full h-[240px]">
                    <ReactCodeMirror
                        className="absolute inset-0 w-full"
                        maxWidth="1029px"
                        readOnly
                        basicSetup={{
                            foldGutter: false,
                        }}
                        extensions={[
                            html({
                                autoCloseTags: true,
                                matchClosingTags: true,
                            }),
                        ]}
                        theme={'dark'}
                        value={`
                        <div class="video" data-youtube-video="QXkSYSPTpj4">
                            <div class="video__link" style="background-image:url(https://i.ytimg.com/vi/QXkSYSPTpj4/maxresdefault.jpg)">
                                <button class="btn btn--with-icon i-svg-youtube youtube-play" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-youtube youtube">
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/svg-sprite/svg-sprite.svg#youtube"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `}
                    />
                </div>
                <div className="rounded relative w-full mb-6 h-[200px]">
                    <ReactCodeMirror
                        className="absolute inset-0 w-full"
                        height="200px"
                        maxWidth="1029px"
                        readOnly
                        basicSetup={{
                            foldGutter: false,
                        }}
                        extensions={[javascript({ jsx: true })]}
                        theme={'dark'}
                        value={`
                    const Video = () => {
                        const videos = document.querySelectorAll('.video')

                        videos.forEach((elem) => {
                            elem.addEventListener('click', () => {
                                const id = elem.dataset.youtubeVideo
                                const title = elem.dataset.frameTitle
                                const link = elem.querySelector('.video__link')
                                const youtubePlay = document.querySelector('.youtube-play')
                                const html = '<iframe src="https://www.youtube-nocookie.com/embed/!!!!ID!!!!?autoplay=1" title="!!!!title!!!!" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                                elem.insertAdjacentHTML('afterbegin', html)
                                youtubePlay.classList.add('fadeOut')
                                setTimeout(() => {
                                    link.remove()
                                }, 300)
                            })
                        })
                    }

                    export default Video

                    Video()
                    `}
                    />
                </div>
            </div>
        </div>
    )
}

export default EditorVideoManual
