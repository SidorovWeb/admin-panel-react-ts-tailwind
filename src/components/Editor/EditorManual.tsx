import { FC } from 'react'
import EditorMapsManual from './EditorMapsManual'
import EditorImagesManual from './EditorImagesManual'
import EditorVideoManual from './EditorVideoManual'

const EditorManual: FC = () => {
    return (
        <div>
            <EditorImagesManual />
            <EditorMapsManual />
            <EditorVideoManual />
        </div>
    )
}

export default EditorManual
