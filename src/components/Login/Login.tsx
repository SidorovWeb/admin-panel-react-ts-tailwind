import axios from 'axios'
import { FC } from 'react'
import { pathAPI } from '../../Constants'
import { IAuth } from '../../interface/auth'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import unlock from '../../assets/icons/unlock.svg'

interface IFormInput {
  password: string
}

interface ILogin {
  setIsAuth: (state: boolean) => void
}

export const Login: FC<ILogin> = ({ setIsAuth }) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onLogin: SubmitHandler<IFormInput> = (data) => {
    axios
      .post<IAuth>(`${pathAPI}login.php`, { password: data.password })
      .then((res) => {
        setIsAuth(res.data.auth)
      })
      .catch((e) => toast.error(`Error! ${e}`))
  }

  return (
    <div className='w-full h-screen'>
      <div className='container px-6 py-12 h-full'>
        <div className='flex justify-center items-center flex-wrap h-full g-6 text-gray-800'>
          <div className='lg:w-6/12 mb-12 md:mb-0'>
            <img src={unlock} alt='unlock' />
          </div>
          <div className='w-full lg:w-5/12'>
            <form onSubmit={handleSubmit(onLogin)} className='text-center space-y-2'>
              <input
                className='block w-full md:w-[70%] lg:w-full mx-auto px-3 py-1.5 text-gray-700 dark:text-white bg-white dark:bg-slate-700 bg-clip-padding border dark:border-slate-700 rounded transition-opacity duration-300 ease-in-out hover:opacity-50 !mt-1 !mb-2 focus:border-blue-600 focus:outline-none'
                type='password'
                placeholder={t('loginPlaceholderPassword') as string}
                {...register('password', {
                  required: t('forgotEnter') as string,
                  minLength: { value: 6, message: t('minimum6') },
                  pattern: {
                    value: /^\S*$/,
                    message: t('passwordNotSpaces'),
                  },
                })}
              />
              {errors.password && <p className='text-red-600 mt-2'>{errors?.password?.message}</p>}

              <button
                type='submit'
                className='btn-primary py-2 px-3 leading-snug rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
              >
                {t('toComeIn')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
