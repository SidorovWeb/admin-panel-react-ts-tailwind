import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { App } from './App'
import './index.css'
import { store } from './store/store'
import './i18n/i18n.js'
import { Suspense } from 'react'
import { OnFullScreen } from './components/Spinners/OnFullScreen'

ReactDOM.createRoot(document.getElementById('App') as HTMLElement).render(
  <Suspense fallback={<OnFullScreen />}>
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>
)
