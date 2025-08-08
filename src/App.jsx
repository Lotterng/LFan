import { useState } from 'react'
import './App.css'
import Home from'./pages/Home.jsx'
import Head from './components/Head.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Head/>
      <Home/>
    </>
  )
}

export default App
