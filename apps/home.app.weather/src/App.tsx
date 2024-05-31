import ReactDOM from 'react-dom/client'

import './index.scss'
import WeatherWidget from './components/WeatherWidget'

const App = () => (
 <WeatherWidget />
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)
