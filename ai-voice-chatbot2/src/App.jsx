import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ModernVoiceChatbot from './component/VoiceChatBot'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ModernVoiceChatbot />
        </div>
    </>
  )
}

export default App
