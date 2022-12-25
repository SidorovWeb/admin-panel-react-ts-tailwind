import { FC, useMemo, useState } from 'react'
import { MdBlurOn, MdClose, MdFormatColorText, MdOutlineFormatColorFill, MdRoundedCorner } from 'react-icons/md'
import { Button } from '../UI/Button'
import { ChromePicker } from 'react-color'

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
  const cl =
    '!p-1 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg w-[32px] h-[32px] m-[2px]'

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
  }

  const includesBlur = () => {
    setBlurPicker(true)
    setColorPicker(false)
    setRoundedCorner(false)
  }

  const includesRoundedCorner = () => {
    setRoundedCorner(true)
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

  const closesPicker = () => {
    setColorPicker(false)
    setBlurPicker(false)
    setRoundedCorner(false)
  }

  return (
    <div className='DragTextPanel-bottom flex items-start mt-[6px]'>
      {colorPicker ? (
        <>
          <ChromePicker color={hexColor} onChange={onChange} className='mr-[6px] mt-[2px]' />
          <Button clName={`btn-danger ${cl}`} onClick={closesPicker}>
            <MdClose className='h-[20px] w-full' />
          </Button>
        </>
      ) : (
        <>
          <Button clName={`btn-default ${cl}`} onClick={() => onClick('text')}>
            <MdFormatColorText className='h-[20px] w-full' />
          </Button>
          <Button clName={`btn-default ${cl}`} onClick={() => onClick('background')}>
            <MdOutlineFormatColorFill className='h-[20px] w-full' />
          </Button>
        </>
      )}
      {blurPicker ? (
        <>
          <div className='bg-white flex py-2 px-4 ml-[4px] rounded'>
            <input
              type='range'
              min='0'
              max='20'
              id='blur-slider'
              step='0.01'
              value={blur}
              onChange={(e) => onChangeBlur(e.target.value)}
            ></input>
          </div>
          <Button clName={`btn-danger ${cl} mt-0 ml-[6px]`} onClick={closesPicker}>
            <MdClose className='h-[20px] w-full' />
          </Button>
        </>
      ) : (
        <Button clName={`btn-default ${cl}`} onClick={includesBlur}>
          <MdBlurOn className='h-[20px] w-full' />
        </Button>
      )}

      {roundedCorner ? (
        <>
          <div className='bg-white flex py-2 px-4 ml-[4px] rounded'>
            <input
              type='range'
              min='0'
              max='50'
              id='blur-slider'
              step='1'
              value={rounded}
              onChange={(e) => onChangeRounded(e.target.value)}
            ></input>
          </div>
          <Button clName={`btn-danger ${cl} mt-0 ml-[6px]`} onClick={closesPicker}>
            <MdClose className='h-[20px] w-full' />
          </Button>
        </>
      ) : (
        <Button clName={`btn-default ${cl}`} onClick={includesRoundedCorner}>
          <MdRoundedCorner className='h-[20px] w-full' />
        </Button>
      )}
    </div>
  )
}