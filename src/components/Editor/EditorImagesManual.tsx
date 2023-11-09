import { html } from '@codemirror/lang-html'
import ReactCodeMirror from '@uiw/react-codemirror'
import { FC } from 'react'

const EditorImagesManual: FC = ({}) => {
    return (
        <div>
            <div className="mt-4">
                <div className="font-bold text-left text-xl mb-4">
                    Изображение
                </div>
                <div className="rounded relative w-full h-[50px]">
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
                        value={`<img class="example" src='images/example.webp' alt='example' width="300" height="187" loading="lazy" />`}
                    />
                </div>
            </div>
        </div>
    )
}

export default EditorImagesManual
