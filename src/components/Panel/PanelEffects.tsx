import { FC, useMemo, useState } from 'react'
import {
  MdBlurOn,
  MdClose,
  MdFormatColorText,
  MdOutlineFormatColorFill,
  MdOutlineFormatSize,
  MdRoundedCorner,
} from 'react-icons/md'
import { Button } from '../UI/Button'
import { ChromePicker } from 'react-color'
import { CSSTransition } from 'react-transition-group'

interface IPanelEffects {
  setStyle: (properties: string, value: string) => void
}
export const PanelEffects: FC<IPanelEffects> = ({ setStyle }) => {
  const [color, setColor] = useState('#ffffff') as any
  const [name, setName] = useState('')
  const [colorPicker, setColorPicker] = useState(false)
  const [blurPicker, setBlurPicker] = useState(false)
  const [blur, setBlur] = useState('0')
  const [roundedCorner, setRoundedCorner] = useState(false)
  const [rounded, setRounded] = useState('0')
  const [fontSize, setFontSize] = useState('16')
  const [isFontSize, setIsFontSize] = useState(false)
  const cl =
    '!p-1 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg  w-[30px] md:w-[34px] h-[30px] md:h-[34px] m-[2px]'

  const decimalToHex = (alpha: any) => (alpha === 0 ? '00' : Math.round(255 * alpha).toString(16))

  const hexColor = useMemo(() => {
    if (typeof color === 'string') {
      return color
    }

    return `${color?.hex}${decimalToHex(color?.rgb?.a)}`
  }, [color])

  const onChange = (color: any) => {
    setColor(color)
    if (name === 'text') setStyle('color', hexColor)
    if (name === 'background') setStyle('background-color', hexColor)
  }

  const onClick = (name: string) => {
    setName(name)
    setColorPicker(true)
    setBlurPicker(false)
    setRoundedCorner(false)
    setIsFontSize(false)
  }

  const includesBlur = () => {
    setBlurPicker(true)
    setColorPicker(false)
    setRoundedCorner(false)
    setIsFontSize(false)
  }

  const includesRoundedCorner = () => {
    setRoundedCorner(true)
    setBlurPicker(false)
    setColorPicker(false)
    setIsFontSize(false)
  }

  const includesFontSize = () => {
    setIsFontSize(true)
    setRoundedCorner(false)
    setBlurPicker(false)
    setColorPicker(false)
  }

  const onChangeBlur = (val: string) => {
    setBlur(val)
    setStyle('filter', `blur(${val}px)`)
  }

  const onChangeRounded = (val: string) => {
    setRounded(val)
    setStyle('border-radius', `${val}px`)
  }

  const onChangeFontSize = (val: string) => {
    setFontSize(val)
    setStyle('font-size', `${val}px`)
  }

  const closesPicker = () => {
    setColorPicker(false)
    setBlurPicker(false)
    setRoundedCorner(false)
    setIsFontSize(false)
  }

  return (
    <div className='DragTextPanel-bottom flex flex-wrap item-center mt-[6px]'>
      {isFontSize ? (
        <CSSTransition in={isFontSize} timeout={500} appear={true} classNames='fade-apsa'>
          <div className='flex items-center'>
            <input
              className='text-gray-700 h-[32px] w-[50px] text-center ml-[4px] rounded'
              type='number'
              min='10'
              max='100'
              value={fontSize}
              onChange={(e) => {
                onChangeFontSize(e.target.value)
              }}
            ></input>

            <Button clName={`btn-danger ${cl}  ml-[6px]`} onClick={closesPicker}>
              <MdClose className='h-full w-full' />
            </Button>
          </div>
        </CSSTransition>
      ) : (
        <Button clName={`btn-default ${cl}`}>
          <MdOutlineFormatSize className='h-[24px] w-full' onClick={includesFontSize} />
        </Button>
      )}

      {colorPicker ? (
        <CSSTransition in={colorPicker} timeout={500} appear={true} classNames='fade-apsa'>
          <div className='flex items-start'>
            <ChromePicker color={hexColor} onChange={onChange} className='mx-[6px] mt-[2px]' />
            <Button clName={`btn-danger ${cl}`} onClick={closesPicker}>
              <MdClose className='h-full w-full' />
            </Button>
          </div>
        </CSSTransition>
      ) : (
        <>
          <Button clName={`btn-default ${cl}`} onClick={() => onClick('text')}>
            <MdFormatColorText className='h-full w-full' />
          </Button>
          <Button clName={`btn-default ${cl}`} onClick={() => onClick('background')}>
            <MdOutlineFormatColorFill className='h-full w-full' />
          </Button>
        </>
      )}
      {blurPicker ? (
        <CSSTransition in={blurPicker} timeout={500} appear={true} classNames='fade-apsa'>
          <div className='flex item-center'>
            <div className='bg-white flex items-center px-4 ml-[4px] rounded'>
              <input
                type='range'
                min='0'
                max='20'
                step='0.01'
                value={blur}
                onChange={(e) => onChangeBlur(e.target.value)}
              ></input>
            </div>
            <Button clName={`btn-danger ${cl} ml-[6px]`} onClick={closesPicker}>
              <MdClose className='h-full w-full' />
            </Button>
          </div>
        </CSSTransition>
      ) : (
        <Button clName={`btn-default ${cl}`} onClick={includesBlur}>
          <MdBlurOn className='h-full w-full' />
        </Button>
      )}

      {roundedCorner ? (
        <CSSTransition in={roundedCorner} timeout={500} appear={true} classNames='fade-apsa'>
          <div className='flex item-center'>
            <div className='bg-white flex items-center px-4 ml-[4px] rounded'>
              <input
                type='range'
                min='0'
                max='50'
                step='1'
                value={rounded}
                onChange={(e) => onChangeRounded(e.target.value)}
              ></input>
            </div>
            <Button clName={`btn-danger ${cl} mt-0 ml-[6px]`} onClick={closesPicker}>
              <MdClose className='h-full w-full' />
            </Button>
          </div>
        </CSSTransition>
      ) : (
        <Button clName={`btn-default ${cl}`} onClick={includesRoundedCorner}>
          <MdRoundedCorner className='h-full w-full' />
        </Button>
      )}
    </div>
  )
}
