import axios from 'axios'
import { toast } from 'react-toastify'
import { pathAPI } from '../constants'
import { published } from './utils'

interface IProcessingImages {
    img: HTMLImageElement
    virtualDom: Document
    setVirtualDom: (dom: Document) => void
    currentPage: string
}

export const processingImages = ({
    img,
    virtualDom,
    setVirtualDom,
    currentPage,
}: IProcessingImages) => {
    const parent: HTMLElement | null =
        img.closest('.my-apsa-img') || (img.parentNode as HTMLElement)

    const inputFile = document.createElement('input')
    inputFile.type = 'file'
    inputFile.accept = 'image/*'
    inputFile.style.display = 'none'

    const id = img.getAttribute('apsa-img')
    if (id) inputFile.setAttribute('id-apsa-img', id)

    parent.appendChild(inputFile)

    inputFile.addEventListener('change', async function (event: Event) {
        const inputEvent = event as InputEvent
        const selectedFile: File | null =
            (inputEvent.target as HTMLInputElement).files?.[0] || null

        if (selectedFile) {
            await uploadImage({
                img,
                id: Number(id),
                virtualDom,
                setVirtualDom,
                file: selectedFile,
            }).then(() => published(virtualDom, currentPage))
        } else {
            toast.error('file not selected')
        }
    })

    parent.addEventListener('click', () => {
        inputFile.click()
    })

    parent.addEventListener('mouseover', () => {
        img.style.filter = 'grayscale(100%) blur(3px)'
        img.style.transition = '.25s ease-in-out'
        parent.style.cursor = 'pointer'
    })

    parent.addEventListener('mouseleave', () => {
        img.style.filter = 'inherit'
        img.style.transition = '.25s ease-in-out'
        parent.style.cursor = 'default'
    })
}

interface IUploadImage {
    img: HTMLImageElement
    id: number
    virtualDom: Document
    setVirtualDom: (dom: Document) => void
    file?: File
    // extension: string
}

export const uploadImage = async ({
    img,
    id,
    virtualDom,
    setVirtualDom,
    file,
}: IUploadImage) => {
    if (!file) {
        return Promise.reject(new Error('No file provided.'))
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
        const response = await axios.post(
            `${pathAPI}uploadImage.php`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )

        const pathPrefix =
            import.meta.env.MODE === 'development' ? '../api/' : './'
        const newSrc = `${pathPrefix}upload_image/${response.data.src}`
        const selectors = `[apsa-img="${id}"]`
        const virtualImg = virtualDom?.body.querySelector(
            selectors
        ) as HTMLImageElement

        const iframeImage = document
            .querySelector('iframe')
            ?.contentDocument?.body.querySelectorAll(
                selectors
            ) as NodeListOf<HTMLImageElement> | null

        if (virtualImg && iframeImage) {
            iframeImage.forEach((element) => {
                element.src = newSrc
                virtualImg.src = newSrc
            })

            setVirtualDom(virtualDom)
            toast.success('Uploaded to folder upload_image')
            return img.src
        } else {
            throw new Error('Image element not found in virtual DOM.')
        }
    } catch (error) {
        toast.error(`Failed to upload! ${error}`)
        throw error
    }
}
