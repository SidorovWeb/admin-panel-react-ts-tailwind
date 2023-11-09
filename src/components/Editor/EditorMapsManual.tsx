import { html } from '@codemirror/lang-html'
import ReactCodeMirror from '@uiw/react-codemirror'
import { FC } from 'react'

const EditorMapsManual: FC = ({}) => {
    return (
        <div>
            <div className="font-bold text-left text-xl mb-4">Карты</div>
            <div className="rounded relative w-full mb-4 h-[50px]">
                <ReactCodeMirror
                    className="absolute inset-0 w-full"
                    height="50px"
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
                    value={`<div id="map" style="width: 400px; height: 400px" data-yamaps="" data-apikey="ваш API-ключ" data-address="г. Москва, Преображенская площадь, 8" data-coordinates="55.755241, 37.617779"></div>`}
                />
            </div>
        </div>
    )
}

export default EditorMapsManual
