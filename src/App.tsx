import './App.css'
import { SimpleDatePicker } from './lib'

function App() {

  return (
    <main style={{width: '100%', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <h1>Example</h1>
      <SimpleDatePicker maxDate={new Date(2024, 3, 16)} minDate={new Date(2024, 0, 1 )} colorSchema='green' activeColor='green.400'/>
    </main>
  )
}

export default App
