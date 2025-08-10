import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from'./pages/Home.jsx'
import Head from './components/Head.jsx'
import Subject from './pages/subjects/Subject.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Head/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/subject/:id" element={<Subject/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
