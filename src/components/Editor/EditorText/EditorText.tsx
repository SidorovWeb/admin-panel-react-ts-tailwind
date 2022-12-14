import React, { FC } from 'react'
import { MdOutlineSearch } from 'react-icons/md'

export const EditorText: FC = () => {
  return (
    <div>
      <div className='mb-3 relative w-full'>
        <MdOutlineSearch className='absolute top-[50%] left-2 translate-y-[-50%] opacity-[0.4] w-6 h-6' />
        <input
          type='search'
          className='form-control block w-full px-10 py-1.5 mx-0 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-6 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          id='exampleSearch'
          placeholder='Имя изображения'
          // value={search}
          // onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className='flex flex-col'>
        <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='overflow-hidden'>
              <table className='min-w-full'>
                <thead className='bg-white border-b'>
                  <tr className='flex'>
                    <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left min-w-[110px]'>
                      Type
                    </th>
                    <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                      Field
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 flex items-start justify-start'>
                    <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap min-w-[110px]'>
                      Headline
                    </td>
                    <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>@mdo</td>
                  </tr>
                  <tr className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 flex items-start justify-start'>
                    <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap min-w-[110px]'>Text</td>
                    <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>@fat</td>
                  </tr>
                  <tr className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 flex items-start justify-start'>
                    <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap min-w-[110px]'>
                      Button
                    </td>
                    <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>@twitter</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
